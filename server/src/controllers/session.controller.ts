import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const startSession = async (userId: string): Promise<string> => {
  // Find the last session for this user
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