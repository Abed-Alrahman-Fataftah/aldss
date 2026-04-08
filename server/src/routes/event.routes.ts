import { Router } from 'express'
import { logEvent, getUserEvents } from '../controllers/event.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { sessionTracker } from '../middleware/session.middleware'

const router = Router()

router.use(requireAuth)
router.use(sessionTracker)

router.post('/log', logEvent)
router.get('/my-events', getUserEvents)

export default router