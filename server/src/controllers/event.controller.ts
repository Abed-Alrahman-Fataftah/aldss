import { Request, Response } from 'express'
import { PrismaClient, EventType } from '@prisma/client'
import { getActiveSessionId } from '../middleware/session.middleware'

const prisma = new PrismaClient()

export const logEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const sessionId = (req as any).sessionId || getActiveSessionId(userId)

    if (!sessionId) {
      return res.status(400).json({ error: 'No active session' })
    }

    const { eventType, contentId, trackId, depthScore, metadata } = req.body

    if (!eventType || !Object.values(EventType).includes(eventType)) {
      return res.status(400).json({ error: 'Invalid event type' })
    }

    const event = await prisma.behavioralEvent.create({
      data: {
        sessionId,
        userId,
        eventType,
        contentId: contentId || null,
        trackId: trackId || null,
        depthScore: depthScore || null,
        metadata: metadata || null
      }
    })

    return res.status(201).json({ eventId: event.id })
  } catch (error) {
    console.error('Log event error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getUserEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const events = await prisma.behavioralEvent.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100
    })

    return res.json(events)
  } catch (error) {
    console.error('Get events error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}