
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();

    res.status(200).json({
      message: "Team retrieved successfully",
      produtos
    });

  } catch (error) {
    console.error("Error in /equipe route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;