
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const apoiadores = await prisma.apoiadores.findMany();
    
    res.status(200).json({
      message: "Supporters retrieved successfully",
      apoiadores
    });

  } catch (error) {
    console.error("Error in /apoiadores route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;