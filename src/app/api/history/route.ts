import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Fetch all question history
    const history = await db.questionHistory.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedHistory = history.map(item => ({
      id: item.id,
      jenjang: item.jenjang,
      kelas: item.kelas || '',
      mapel: item.mapel,
      tipeSoal: item.tipeSoal,
      bahasa: item.bahasa,
      topic: item.topic,
      questions: JSON.parse(item.questions),
      createdAt: item.createdAt.toISOString(),
    }))

    return NextResponse.json({ history: formattedHistory })

  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}