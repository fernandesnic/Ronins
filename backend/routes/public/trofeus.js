import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const trofeus = await prisma.CampeonatoGanho.findMany({
      orderBy: {
        ano: 'desc'
      },
      include: {
        elenco: {
          include: {
            jogador: true,
            staff: true
          }
        }
      }
    });
    res.status(200).json({ trofeus });
  } catch (error) {
    console.error("Erro ao buscar troféus:", error);
    res.status(500).json({ error: "Erro ao buscar troféus." });
  }
});

export default router;