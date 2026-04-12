import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const startSession = async (userId: string): Promise<string> => {
  const lastSession = await prisma.session.findFirst({
    where: { userId },
    orderBy: { startedAt: 'desc' }
  })

  let daysSinceLast: number | null = null

  if (lastSession) {
    const diffMs = Date.now() - lastSession.startedAt.getTime()
    daysSinceLast = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  }

  const session = await prisma.session.create({
    data: {
      userId,
      daysSinceLast
    }
  })

  return session.id
}

export const endSession = async (sessionId: string): Promise<void> => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId }
  })

  if (!session) return

  const durationSeconds = Math.floor(
    (Date.now() - session.startedAt.getTime()) / 1000
  )

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      endedAt: new Date(),
      durationSeconds
    }
  })
}

export const getMySessionSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId

    const allSessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { startedAt: 'asc' }
    })

    const totalSessions = allSessions.length

    // Calculate duration — use durationSeconds if available,
    // otherwise estimate from startedAt to now (for open sessions)
    const totalSeconds = allSessions.reduce((sum, s) => {
      if (s.durationSeconds) {
        return sum + s.durationSeconds
      }
      // Open session — estimate duration
      const estimated = Math.floor(
        (Date.now() - s.startedAt.getTime()) / 1000
      )
      // Cap at 2 hours to avoid inflated numbers from forgotten sessions
      return sum + Math.min(estimated, 7200)
    }, 0)

    const totalMinutes = Math.round(totalSeconds / 60)

    const avgSessionMinutes = totalSessions > 0
      ? Math.round(totalMinutes / totalSessions)
      : 0

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const lastSevenDays = allSessions.filter(s => s.startedAt >= sevenDaysAgo).length

    res.json({
      totalSessions,
      totalMinutes,
      avgSessionMinutes,
      lastSevenDays
    })
  } catch (error) {
    console.error('Session summary error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}