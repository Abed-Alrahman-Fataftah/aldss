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