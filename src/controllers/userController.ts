import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import { hashPassword, verifyPassword, generateToken } from "../utils/auth";

export const registerUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};
