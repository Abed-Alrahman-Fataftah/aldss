import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTracks = async (req: Request, res: Response) => {
  try {
    const tracks = await prisma.track.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
      include: {
        _count: { select: { modules: true } },
      },
    });
    return res.json(tracks);
  } catch (error) {
    console.error("Get tracks error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getModules = async (req: Request, res: Response) => {
  try {
    const trackId = req.params.trackId as string;
    const modules = await prisma.module.findMany({
      where: { trackId, isActive: true },
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        orderIndex: true,
        trackId: true,
        _count: { select: { quizzes: true } },
      },
    });
    return res.json(modules);
  } catch (error) {
    console.error("Get modules error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getModule = async (req: Request, res: Response) => {
  try {
    const moduleId = req.params.moduleId as string;
    const userId = (req as any).userId;

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { quizzes: true, track: true },
    });

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Log content view event
    const sessionId = (req as any).sessionId;
    if (sessionId) {
      await prisma.behavioralEvent.create({
        data: {
          sessionId,
          userId,
          eventType: "CONTENT_VIEW",
          contentId: moduleId,
          trackId: module.trackId,
          metadata: {
            moduleTitle: module.title,
            trackTitle: module.track.title,
          },
        },
      });
    }

    // Hide correct answers from the response
    const safeModule = {
      ...module,
      quizzes: module.quizzes.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
      })),
    };

    return res.json(safeModule);
  } catch (error) {
    console.error("Get module error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const moduleId = req.params.moduleId as string;
    const { answers } = req.body;
    const userId = (req as any).userId;
    const sessionId = (req as any).sessionId;

    const quizzes = await prisma.quiz.findMany({
      where: { moduleId },
    });

    if (!answers || Object.keys(answers).length !== quizzes.length) {
      return res.status(400).json({ error: "Please answer all questions" });
    }

    let correct = 0;
    const results = quizzes.map((q) => {
      const userAnswer = parseInt(answers[q.id]);
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) correct++;
      return {
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correct,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correct / quizzes.length) * 100);

    // Log quiz attempt event
    if (sessionId) {
      await prisma.behavioralEvent.create({
        data: {
          sessionId,
          userId,
          eventType: "QUIZ_ATTEMPT",
          contentId: moduleId,
          depthScore: score / 100,
          metadata: {
            score,
            correct,
            total: quizzes.length,
            answers,
          },
        },
      });

      await prisma.behavioralEvent.create({
        data: {
          sessionId,
          userId,
          eventType: "QUIZ_COMPLETE",
          contentId: moduleId,
          metadata: { score, passed: score >= 60 },
        },
      });
    }

    return res.json({ score, correct, total: quizzes.length, results });
  } catch (error) {
    console.error("Submit quiz error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logPathSwitch = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const sessionId = (req as any).sessionId;
    const { fromTrackId, toTrackId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "No active session" });
    }

    await prisma.behavioralEvent.create({
      data: {
        sessionId,
        userId,
        eventType: "PATH_SWITCH",
        metadata: { fromTrackId, toTrackId },
      },
    });

    return res.json({ logged: true });
  } catch (error) {
    console.error("Log path switch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
