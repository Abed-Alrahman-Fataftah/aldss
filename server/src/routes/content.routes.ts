import { Router } from 'express'
import {
  getTracks,
  getModules,
  getModule,
  submitQuiz,
  logPathSwitch
} from '../controllers/content.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { sessionTracker } from '../middleware/session.middleware'

const router = Router()
router.use(requireAuth)
router.use(sessionTracker)

router.get('/tracks', getTracks)
router.get('/tracks/:trackId/modules', getModules)
router.get('/modules/:moduleId', getModule)
router.post('/modules/:moduleId/quiz', submitQuiz)
router.post('/path-switch', logPathSwitch)

export default router