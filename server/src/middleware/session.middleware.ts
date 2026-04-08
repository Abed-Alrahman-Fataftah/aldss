import { Request, Response, NextFunction } from 'express'
import { startSession } from '../controllers/session.controller'

// In-memory session store — maps userId to current sessionId
// In production this would be Redis, but for research purposes this works fine
const activeSessions = new Map<string, { sessionId: string; lastActivity: number }>()

const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes of inactivity = new session

export const sessionTracker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).userId
  if (!userId) return next()

  const now = Date.now()
  const existing = activeSessions.get(userId)

  if (!existing || now - existing.lastActivity > SESSION_TIMEOUT_MS) {
    // Start a new session
    try {
      const sessionId = await startSession(userId)
      activeSessions.set(userId, { sessionId, lastActivity: now })
      ;(req as any).sessionId = sessionId
    } catch (error) {
      console.error('Session tracking error:', error)
    }
  } else {
    // Continue existing session
    activeSessions.set(userId, { ...existing, lastActivity: now })
    ;(req as any).sessionId = existing.sessionId
  }

  next()
}

export const getActiveSessionId = (userId: string): string | undefined => {
  return activeSessions.get(userId)?.sessionId
}