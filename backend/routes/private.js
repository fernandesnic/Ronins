import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/list", async (req, res) => {
  try {
    const users = await prisma.User.findMany();

    const usersWithoutPassword = users.map((user) => {
      const { senha, ...userSemSenha } = user;
      return userSemSenha;
    });

    res
      .status(200)
      .json({ message: "Users retrieved successfully", users: usersWithoutPassword });
  } catch (error) {
    console.error("Error in /list route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;