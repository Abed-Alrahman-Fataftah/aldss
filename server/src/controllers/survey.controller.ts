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