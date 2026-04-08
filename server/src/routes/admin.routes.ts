import { Router } from 'express'
import {
  getStudyOverview,
  getAllParticipants,
  getParticipantDetail,
  getRecentActivity
} from '../controllers/admin.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.use(requireAuth)

router.get('/overview', getStudyOverview)
router.get('/participants', getAllParticipants)
router.get('/participants/:userId', getParticipantDetail)
router.get('/activity', getRecentActivity)

export default router