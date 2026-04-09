import { Request, Response } from 'express'
import axios from 'axios'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export const triggerWeeklyDQD = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/run-weekly`)
    return res.json(response.data)
  } catch (error) {
    console.error('AI service error:', error)
    return res.status(500).json({ error: 'AI service unavailable' })
  }
}

export const getUserDQD = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const response = await axios.get(`${AI_SERVICE_URL}/compute-dqd/${userId}`)
    return res.json(response.data)
  } catch (error) {
    console.error('AI service error:', error)
    return res.status(500).json({ error: 'AI service unavailable' })
  }
}

export const getParticipantsSummary = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/participants-summary`)
    return res.json(response.data)
  } catch (error) {
    console.error('AI service error:', error)
    return res.status(500).json({ error: 'AI service unavailable' })
  }
}
export const runInterventions = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/run-interventions`)
    return res.json(response.data)
  } catch (error) {
    console.error('AI service error:', error)
    return res.status(500).json({ error: 'AI service unavailable' })
  }
}

export const getPendingIntervention = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const response = await axios.get(`${AI_SERVICE_URL}/pending-intervention/${userId}`)
    return res.json(response.data)
  } catch (error) {
    console.error('AI service error:', error)
    return res.status(500).json({ error: 'AI service unavailable' })
  }
}

export const acknowledgeIntervention = async (req: Request, res: Response) => {
  try {
    const { interventionId } = req.params
    const { accepted, rating } = req.body
    const response = await axios.post(
      `${AI_SERVICE_URL}/acknowledge-intervention/${interventionId}`,
      null,
      { params: { accepted, rating } }
    )

    // Log the intervention response as a behavioral event
    const userId = (req as any).userId
    const sessionId = (req as any).sessionId
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    if (sessionId) {
      await prisma.behavioralEvent.create({
        data: {
          sessionId,
          userId,
          eventType: accepted ? 'INTERVENTION_ACCEPTED' : 'INTERVENTION_DISMISSED',
          metadata: { interventionId, rating }
        }
      })
    }

    return res.json(response.data)
  } catch (error) {
    console.error('Acknowledge error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const runFullPipeline = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/run-full-pipeline`)
    return res.json(response.data)
  } catch (error) {
    console.error('AI service error:', error)
    return res.status(500).json({ error: 'AI service unavailable' })
  }
}