import { Router } from 'express'
import { getMySessionSummary } from '../controllers/session.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.use(requireAuth)
router.get('/my-summary', getMySessionSummary)

export default router