import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jsonrepair } from "jsonrepair";

type Message = { role: "system" | "user" | "assistant"; content: string };

const isFlash = (m: string) => m.includes("flash");

// BATAS TOKENS UNTUK FLASH
const flashMaxTokens = (n: number) => {
  if (n <= 10) return 2000;
  if (n <= 20) return 1500;
  if (n <= 40) return 1200;
  return 900;
};

// DIPAKAI UNTUK MEMECAH PERMINTAAN MENJADI BATCH
const calculateBatchSize = (model: string, total: number) => {
  if (!isFlash(model)) return total; // model normal → tidak butuh batch
  if (total <= 10) return 10;
  if (total <= 20) return 10;
  if (total <= 40) return 10;
  return 10; // batch kecil → aman di flash
};

// EXTRACT JSON ARRAY
const extractJson = (text: string) => {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;

  let s = match[0];
  s = s.replace(/,\s*(\]|\})/g, "$1"); // trailing commas

  return s;
};

// NORMAL VALIDATOR
const validate = (arr: any[], expected?: number) => {
  if (!Array.isArray(arr)) return false;
  if (expected && arr.length !== expected) return false;

  for (const q of arr) {
    if (!q || typeof q !== "object") return false;
    if (!q.question) return false;
  }
  return true;
};

// ========== OPENROUTER ==========
const callOpenRouter = async (messages: Message[], model: string, maxTokens: number) => {
  const key = process.env.OPENROUTER_API_KEY ?? "";

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}`, "X-OpenAI-Api-Key": key } : {}),
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "AI Question Generator",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);

  return res.json();
};

// ========== GLM (BIGMODEL) ==========
const callBigModel = async (messages: Message[], model: string, maxTokens: number) => {
  const key = process.env.BIGMODEL_API_KEY ?? "";

  const res = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
      thinking: { type: "enabled" },
    }),
  });

  if (!res.ok) throw new Error(`GLM API error: ${res.status}`);

  const data = await res.json();

  return {
    choices: [
      {
        message: {
          content:
            data?.choices?.[0]?.message?.content ??
            data?.choices?.[0]?.text ??
            "",
        },
      },
    ],
  };
};

// ========== BATCH MODE EXECUTOR ==========
async function runBatch(
  messagesBase: Message[],
  model: string,
  jumlah: number,
  batchSize: number
) {
  const final: any[] = [];
  let remaining = jumlah;

  while (remaining > 0) {
    const take = Math.min(batchSize, remaining);
    console.log(`→ Running batch: ${take} soal`);

    const sys = messagesBase[0];
    const usr = messagesBase[1];

    const batchMsg: Message[] = [
      sys,
      {
        role: "user",
        content:
          usr.content +
          `\nIMPORTANT: This batch must return EXACTLY ${take} items ONLY.`,
      },
    ];

    let batchOutput = null;
    let tries = 0;
    const maxTries = 2;

    while (!batchOutput && tries < maxTries) {
      tries++;

      try {
        const maxTokens = isFlash(model)
          ? flashMaxTokens(take)
          : 4096;

        const resp = model.startsWith("glm-")
          ? await callBigModel(batchMsg, model, maxTokens)
          : await callOpenRouter(batchMsg, model, maxTokens);

        const raw = resp?.choices?.[0]?.message?.content ?? "";

        let jsonText = extractJson(raw);
        if (!jsonText) throw new Error("No JSON detected");

        let parsed;

        try {
          parsed = JSON.parse(jsonText);
        } catch {
          parsed = JSON.parse(jsonrepair(jsonText));
        }

        if (!validate(parsed, take)) throw new Error("Invalid JSON structure");

        batchOutput = parsed;
      } catch (err) {
        console.warn(`Batch attempt ${tries} failed:`, err);
        if (tries >= maxTries && isFlash(model)) {
          console.log("FLASH failed → fallback GLM-4.6 for this batch");
          model = "glm-4.6"; // fallback
        }
      }
    }

    if (!batchOutput)
      throw new Error(`Batch failed after retries.`);

    final.push(...batchOutput);
    remaining -= take;
  }

  return final;
}

// ========================= ROUTE ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

    const { jenjang, kelas, mapel, tipeSoal, bahasa, topic, jumlahSoal, model } = body;

    if (!jenjang || !mapel || !tipeSoal || !bahasa || !topic || !jumlahSoal)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const num = Number(jumlahSoal);

    let selectedModel =
      model ||
      process.env.OPENROUTER_MODEL ||
      "meta-llama/llama-3.1-8b-instruct";

    if (!process.env.OPENROUTER_API_KEY && !selectedModel.startsWith("glm-")) {
      selectedModel = "glm-4.6"; // fallback
    }

    // ❗ DETEKSI BATCH SIZE
    const batchSize = calculateBatchSize(selectedModel, num);

    // ========== PROMPTS ==========
    const systemPrompt = `You are an expert question generator. Return ONLY JSON array.`;

    const userPrompt = `
Buatkan soal ${tipeSoal} jenjang ${jenjang} kelas ${kelas} mapel ${mapel} 
topik ${topic} sebanyak ${num} dalam bahasa ${bahasa}.
FORMAT:
[
  { "id":"x","question":"...","type":"...","difficulty":"...","options":[],"correctAnswer":"" }
]
ONLY JSON array.
`;

    // ========== RUN BATCH MODE ==========
    const questions = await runBatch(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      selectedModel,
      num,
      batchSize
    );

    // SAVE
    await db.questionHistory.create({
      data: {
        jenjang,
        kelas: kelas ?? "",
        mapel,
        tipeSoal,
        bahasa,
        topic,
        questions: JSON.stringify(questions),
      },
    });

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
