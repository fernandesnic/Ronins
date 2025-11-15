import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const produto = await prisma.produto.findUnique({
      where: { id: id },
      include: {
        variacoes: true 
      }
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(200).json({ produto });

  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;