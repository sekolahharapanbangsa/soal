# 🎓 AI Question Generator

Aplikasi web untuk generate pertanyaan berkualitas menggunakan AI dengan fitur export ke Word dan riwayat.

## ✨ Fitur

- ✅ **Generate Pertanyaan AI** - Menggunakan OpenRouter API dengan berbagai model AI
- ✅ **Multi Jenjang Pendidikan** - SD, SMP, SMA dengan mapel sesuai kurikulum
- ✅ **3 Tipe Soal** - Multiple Choice, Essay, dan True/False
- ✅ **2 Bahasa** - Indonesia dan English
- ✅ **Multi AI Model** - Pilihan model gratis dan premium dari OpenRouter
- ✅ **Pilihan Jawaban Adaptif** - 4 pilihan (A-D) untuk SD/SMP, 5 pilihan (A-E) untuk SMA
- ✅ **Export ke Word** - Download hasil pertanyaan dalam format .docx dengan format lengkap
- ✅ **Riwayat Pertanyaan** - Simpan dan lihat kembali pertanyaan yang pernah dibuat
- ✅ **Responsive Design** - Bekerja dengan baik di desktop dan mobile
- ✅ **Database Storage** - Menyimpan riwayat di PostgreSQL database (Neon)

## 🛠️ Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework dengan App Router
- **📘 TypeScript 5** - Type-safe JavaScript
- **🎨 Tailwind CSS 4** - Utility-first CSS framework
- **🧩 shadcn/ui** - Komponen UI modern dan accessible

### AI & Backend
- **🤖 OpenRouter SDK** - Multi-model AI integration
- **🗄️ Prisma ORM** - Database management dengan PostgreSQL
- **📄 docx library** - Export ke Word document
- **🔐 NextAuth.js** - Authentication system

### UI & UX
- **🎯 Lucide React** - Icon library
- **🌈 Framer Motion** - Animasi dan transisi
- **📊 React Hook Form** - Form management
- **✅ Zod** - Schema validation

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/sekolahharapanbangsa/soal.git
cd soal-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` dan tambahkan konfigurasi berikut:

```env
# Database
DATABASE_URL=""

# NextAuth (Required for production)
NEXTAUTH_URL=""
NEXTAUTH_SECRET=""

# Environment
NODE_ENV="development"  # Ganti ke "production" untuk deployment
```

### 4. Database Setup
```bash
# Push schema ke database
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 5. Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi berjalan.

## 📖 Cara Penggunaan

### 1. Pilih Jenjang Pendidikan
- **SD (Sekolah Dasar)** - 4 pilihan jawaban (A-D)
- **SMP (Sekolah Menengah Pertama)** - 4 pilihan jawaban (A-D)  
- **SMA (Sekolah Menengah Atas)** - 5 pilihan jawaban (A-E)

### 2. Pilih Tipe Soal
- **Pilihan Ganda** - Soal dengan beberapa pilihan jawaban
- **Essay** - Soal uraian yang memerlukan jawaban panjang
- **Benar/Salah** - Soal pernyataan yang hanya memiliki dua pilihan jawaban

### 3. Pilih Bahasa
- **Indonesia** - Soal dalam bahasa Indonesia
- **English** - Soal dalam bahasa Inggris

### 4. Pilih Mata Pelajaran
Tersedia mapel sesuai kurikulum untuk setiap jenjang.

### 5. Isi Topik dan Prompt
- **Topik/Subtopik** (contoh: Persamaan Kuadrat, Fotosintesis)
- **Prompt Detail** (contoh: "Buat 5 soal pilihan ganda dengan tingkat kesulitan sedang")

### 6. Generate dan Export
- Klik **Generate Pertanyaan** untuk membuat soal
- Klik **Export Word** untuk download file .docx

## 🤖 AI Models

### Model Gratis
- **DeepSeek-R1** - Advanced reasoning capabilities
- **Llama 3.1 8B** - Model terbaru dari Meta
- **Phi-3 Medium** - Model dari Microsoft dengan konteks 128k
- **Qwen 2.5 7B** - Model dari Alibaba dengan kemampuan multibahasa
- **Gemma 2 9B** - Model dari Google dengan performa optimal
- **Mistral 7B** - Model populer dari Mistral AI
- **Zephyr 7B** - Model ringan dengan hasil baik

### Model Premium
- **Claude 3.5 Sonnet** - Model default, kualitas terbaik untuk educational content
- **GPT-4o** - Model terbaru dari OpenAI dengan kemampuan multimodal
- **GPT-4o Mini** - Versi lebih cepat dan murah dari GPT-4o
- **Gemini Pro 1.5** - Model dari Google dengan performa tinggi
- **Llama 3.1 70B** - Model besar dengan kemampuan reasoning superior
- **Phi-3.5 Mini** - Model kecil namun powerful dari Microsoft
- **DeepSeek Chat** - Model dari China dengan kemampuan coding baik
- **Grok 2** - Model dari xAI dengan kemampuan real-time

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── generate-questions/  # AI question generation
│   │   └── history/             # Question history management
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── db.ts            # Database connection
│   └── utils.ts         # Helper functions
└── public/              # Static assets
    └── icons/ai-models/ # AI model icons
```

## 🗄️ Database Schema

```prisma
model QuestionHistory {
  id          String   @id @default(cuid())
  jenjang     String   // SD, SMP, SMA
  kelas       String   @default("") // Kelas 1-12
  mapel       String   // Mata Pelajaran
  tipeSoal    String   // multiple-choice, essay, true-false
  bahasa      String   // indonesia, english
  topic       String
  questions   String   // JSON string of generated questions
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🚀 Deployment

### Vercel Deployment
1. Push kode ke repository
2. Connect repository ke Vercel
3. Setup environment variables di Vercel dashboard
4. Deploy

### Environment Variables untuk Production
```env
NODE_ENV="production"
NEXTAUTH_URL=""
NEXT_PUBLIC_APP_URL=""
```

## 📝 API Endpoints

### `POST /api/generate-questions`
Generate pertanyaan menggunakan AI.

**Request:**
```json
{
  "jenjang": "sma",
  "kelas": "11",
  "mapel": "Matematika Peminatan",
  "tipeSoal": "multiple-choice",
  "bahasa": "indonesia",
  "topic": "Persamaan Kuadrat",
  "jumlahSoal": "5",
  "model": "anthropic/claude-3.5-sonnet"
}
```

**Response:**
```json
{
  "questions": [
    {
      "id": "q_1",
      "question": "Apa rumus diskriminan dari persamaan kuadrat ax² + bx + c = 0?",
      "type": "Pilihan Ganda",
      "difficulty": "Sedang",
      "options": [
        "D = b² - 4ac",
        "D = b² + 4ac", 
        "D = 4ac - b²",
        "D = a² - 4bc",
        "D = 4ab - c²"
      ],
      "correctAnswer": "A"
    }
  ]
}
```

### `GET /api/history`
Mendapatkan semua riwayat pertanyaan.

## 🎯 Features Detail

### Export Word Format
File Word yang dihasilkan memiliki format:
- **Header**: Jenjang, Mapel, Tipe Soal, Bahasa, Topik, dan waktu generate
- **Pertanyaan**: Nomor urut dan teks pertanyaan (bold)
- **Pilihan Jawaban**: Format A, B, C, D (SD/SMP) atau A, B, C, D, E (SMA)
- **Jawaban Benar**: Ditandai dengan warna hijau
- **Metadata**: Tipe soal dan tingkat kesulitan

### Question History
- Simpan semua pertanyaan yang pernah dibuat
- Filter berdasarkan jenjang, mapel, dan tanggal
- Load kembali pertanyaan untuk diedit
- Export pertanyaan tertentu ke Word

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized untuk tablet dan desktop
- Smooth animations dan transitions

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push      # Push schema ke database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database

# Linting
npm run lint
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Project ini dilisensikan under MIT License - lihat [LICENSE](LICENSE) file untuk details.

## 🙏 Acknowledgments

- **OpenRouter** - Multi-model AI API
- **Neon** - PostgreSQL database hosting
- **Vercel** - Deployment platform
- **shadcn/ui** - UI component library

---

Built with ❤️ untuk pendidikan di Indonesia oleh [Sekolah Harapan Bangsa](https://shb.sch.id) 🎓