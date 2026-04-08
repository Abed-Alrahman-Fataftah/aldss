import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getStudyOverview = async (req: Request, res: Response) => {
  try {
    const totalParticipants = await prisma.user.count()
    const controlGroup = await prisma.user.count({ where: { group: 'CONTROL' } })
    const interventionGroup = await prisma.user.count({ where: { group: 'INTERVENTION' } })
    const activeParticipants = await prisma.user.count({ where: { isActive: true } })

    const totalSessions = await prisma.session.count()
    const totalEvents = await prisma.behavioralEvent.count()
    const totalSurveys = await prisma.surveyResponse.count()
    const totalInterventions = await prisma.intervention.count()

    // Sessions in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentSessions = await prisma.session.count({
      where: { startedAt: { gte: sevenDaysAgo } }
    })

    // Average motivation from latest weekly surveys
    const recentSurveys = await prisma.surveyResponse.findMany({
      where: {
        surveyType: 'WEEKLY',
        submittedAt: { gte: sevenDaysAgo }
      },
      select: { motivationScore: true, perceivedProgress: true }
    })

    const avgMotivation = recentSurveys.length
      ? recentSurveys.reduce((sum, s) => sum + (s.motivationScore || 0), 0) / recentSurveys.length
      : null

    const avgProgress = recentSurveys.length
      ? recentSurveys.reduce((sum, s) => sum + (s.perceivedProgress || 0), 0) / recentSurveys.length
      : null

    return res.json({
      participants: {
        total: totalParticipants,
        active: activeParticipants,
        control: controlGroup,
        intervention: interventionGroup
      },
      activity: {
        totalSessions,
        totalEvents,
        totalSurveys,
        totalInterventions,
        recentSessions
      },
      sentiment: {
        avgMotivation: avgMotivation ? Math.round(avgMotivation * 10) / 10 : null,
        avgProgress: avgProgress ? Math.round(avgProgress * 10) / 10 : null,
        surveyCount: recentSurveys.length
      }
    })
  } catch (error) {
    console.error('Admin overview error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAllParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await prisma.user.findMany({
      orderBy: { enrolledAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        group: true,
        isActive: true,
        enrolledAt: true,
        fieldOfStudy: true,
        studyLevel: true,
        _count: {
          select: {
            sessions: true,
            events: true,
            surveys: true,
            interventions: true
          }
        }
      }
    })

    // For each participant get their last session date
    const participantsWithLastSeen = await Promise.all(
      participants.map(async p => {
        const lastSession = await prisma.session.findFirst({
          where: { userId: p.id },
          orderBy: { startedAt: 'desc' },
          select: { startedAt: true }
        })

        const lastSurvey = await prisma.surveyResponse.findFirst({
          where: { userId: p.id, surveyType: 'WEEKLY' },
          orderBy: { submittedAt: 'desc' },
          select: { weekNumber: true, submittedAt: true }
        })

        const daysSinceLastSeen = lastSession
          ? Math.floor((Date.now() - lastSession.startedAt.getTime()) / (1000 * 60 * 60 * 24))
          : null

        return {
          ...p,
          lastSeenAt: lastSession?.startedAt || null,
          daysSinceLastSeen,
          atRisk: daysSinceLastSeen !== null && daysSinceLastSeen >= 5,
          lastSurveyWeek: lastSurvey?.weekNumber || 0
        }
      })
    )

    return res.json(participantsWithLastSeen)
  } catch (error) {
    console.error('Get participants error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getParticipantDetail = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: {
          orderBy: { startedAt: 'desc' },
          take: 10
        },
        surveys: {
          orderBy: { submittedAt: 'desc' },
          take: 20
        },
        dqdSnapshots: {
          orderBy: { weekNumber: 'desc' },
          take: 16
        },
        interventions: {
          orderBy: { triggeredAt: 'desc' },
          take: 10
        },
        _count: {
          select: { events: true, sessions: true }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Participant not found' })
    }

    return res.json(user)
  } catch (error) {
    console.error('Participant detail error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const recentEvents = await prisma.behavioralEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: {
        user: { select: { fullName: true, group: true } }
      }
    })

    return res.json(recentEvents)
  } catch (error) {
    console.error('Recent activity error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}