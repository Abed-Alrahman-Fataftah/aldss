import { Request, Response } from 'express'
import { PrismaClient, SurveyType } from '@prisma/client'

const prisma = new PrismaClient()

export const submitSurvey = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const {
      surveyType,
      weekNumber,
      perceivedProgress,
      motivationScore,
      studyHours,
      mainChallenge,
      responses
    } = req.body

    if (!surveyType || !Object.values(SurveyType).includes(surveyType)) {
      return res.status(400).json({ error: 'Invalid survey type' })
    }

    const survey = await prisma.surveyResponse.create({
      data: {
        userId,
        surveyType,
        weekNumber: weekNumber || 0,
        perceivedProgress: perceivedProgress || null,
        motivationScore: motivationScore || null,
        studyHours: studyHours || null,
        mainChallenge: mainChallenge || null,
        responses: responses || null
      }
    })

    return res.status(201).json({ surveyId: survey.id })
  } catch (error) {
    console.error('Survey submit error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
export const getWeeklySurveyStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    // Get the most recent weekly survey for this user
    const latest = await prisma.surveyResponse.findFirst({
      where: { userId, surveyType: 'WEEKLY' },
      orderBy: { submittedAt: 'desc' }
    })

    if (!latest) {
      return res.json({ due: true, weekNumber: 1, lastSubmitted: null })
    }

    const daysSinceLastSurvey = Math.floor(
      (Date.now() - latest.submittedAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    return res.json({
      due: daysSinceLastSurvey >= 7,
      weekNumber: latest.weekNumber + 1,
      lastSubmitted: latest.submittedAt,
      daysSince: daysSinceLastSurvey
    })
  } catch (error) {
    console.error('Survey status error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getMySurveys = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const surveys = await prisma.surveyResponse.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' }
    })

    return res.json(surveys)
  } catch (error) {
    console.error('Get surveys error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}