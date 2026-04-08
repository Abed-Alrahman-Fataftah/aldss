import { Router } from 'express'
import { submitSurvey } from '../controllers/survey.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { sessionTracker } from '../middleware/session.middleware'

const router = Router()
router.use(requireAuth)
router.use(sessionTracker)
router.post('/submit', submitSurvey)

export default router