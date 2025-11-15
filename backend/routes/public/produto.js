import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// -----------------------------------------------------------------
// ROTA DA VITRINE (LISTA) - /api/public/produto/
// (Esta rota você já tinha, ela busca os produtos "Pai")
// -----------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    // Busca SÓ os produtos "Pai"
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: 'asc' } // Opcional: ordenar por nome
    });

    res.status(200).json({
      message: "Produtos recuperados com sucesso",
      produtos
    });

  } catch (error) {
    console.error("Erro em /api/public/produto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -----------------------------------------------------------------
// ROTA DE DETALHES - /api/public/produto/:id
// (Esta é a nova rota que estava faltando)
// -----------------------------------------------------------------
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Validação simples
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID de produto inválido." });
    }

    // Busca o produto "Pai" E inclui suas "Filhas" (variantes)
    const produto = await prisma.produto.findUnique({
      where: { id: id },
      include: {
        variacoes: true // Inclui todas as variantes (tamanhos, cores, etc.)
      }
    });

    if (!produto) {
      // Este é o 404 que você está vendo
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Se encontrou, retorna o produto com suas variantes
    res.status(200).json({ produto });

  } catch (error) {
    next(error); // Passa o erro para seu error handler global
  }
});


export default router;