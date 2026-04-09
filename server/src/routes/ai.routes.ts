import { Router } from "express";
import {
  triggerWeeklyDQD,
  getUserDQD,
  getParticipantsSummary,
  runInterventions,
  getPendingIntervention,
  acknowledgeIntervention,
  runFullPipeline,
} from "../controllers/ai.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { sessionTracker } from "../middleware/session.middleware";

const router = Router();
router.use(requireAuth);

router.post("/run-weekly", triggerWeeklyDQD);
router.post("/run-interventions", runInterventions);
router.post("/run-full-pipeline", runFullPipeline);
router.get("/dqd/:userId", getUserDQD);
router.get("/summary", getParticipantsSummary);
router.get("/pending-intervention", sessionTracker, getPendingIntervention);
router.post(
  "/acknowledge/:interventionId",
  sessionTracker,
  acknowledgeIntervention,
);

export default router;
