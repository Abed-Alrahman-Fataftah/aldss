import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, Group } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      fullName,
      ageRange,
      studyLevel,
      fieldOfStudy,
      weeklyStudyHours,
      consentGiven,
    } = req.body;

    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ error: "Email, password and full name are required" });
    }

    if (!consentGiven) {
      return res
        .status(400)
        .json({ error: "Consent is required to participate" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Random group assignment — alternating control/intervention
    const userCount = await prisma.user.count();
    const group: Group =
      userCount % 2 === 0 ? Group.CONTROL : Group.INTERVENTION;

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        group,
        consentGiven: true,
        ageRange,
        studyLevel,
        fieldOfStudy,
        weeklyStudyHours: weeklyStudyHours ? parseInt(weeklyStudyHours) : null,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" },
    );

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        group: user.group,
        enrolledAt: user.enrolledAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" },
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        group: user.group,
        enrolledAt: user.enrolledAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        group: true,
        consentGiven: true,
        enrolledAt: true,
        isActive: true,
        ageRange: true,
        studyLevel: true,
        fieldOfStudy: true,
        weeklyStudyHours: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
