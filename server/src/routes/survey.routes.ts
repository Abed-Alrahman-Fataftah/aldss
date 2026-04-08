import { Router } from 'express'
import { submitSurvey, getWeeklySurveyStatus, getMySurveys } from '../controllers/survey.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { sessionTracker } from '../middleware/session.middleware'

const router = Router()
router.use(requireAuth)
router.use(sessionTracker)

router.post('/submit', submitSurvey)
router.get('/weekly-status', getWeeklySurveyStatus)
router.get('/my-surveys', getMySurveys)

export default router