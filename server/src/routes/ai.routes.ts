import { Router } from 'express'
import { triggerWeeklyDQD, getUserDQD, getParticipantsSummary } from '../controllers/ai.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.use(requireAuth)

router.post('/run-weekly', triggerWeeklyDQD)
router.get('/dqd/:userId', getUserDQD)
router.get('/summary', getParticipantsSummary)

export default router