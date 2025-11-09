import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const removePassword = (user) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};


router.get("/kpis", async (req, res) => {
  try {
    
    const agregacao = await prisma.Venda.aggregate({
      _sum: {
        preco_final: true, 
      },
      _count: {
        id: true, 
      },
    });

    const pendentes = await prisma.Venda.count({
      where: { foi_entregue: false },
    });

    res.status(200).json({
      message: "KPIs retrieved successfully",
      kpis: {
        receitaTotal: agregacao._sum.preco_final || 0,
        totalVendas: agregacao._count.id || 0,
        pendentes: pendentes || 0,
      },
    });
  } catch (error) {
    console.error("Error in /kpis route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/list", async (req, res) => {
  try {
    const vendas = await prisma.Venda.findMany({
      include: {
        user: true, 
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    const vendasLimpas = vendas.map((venda) => {
      if (venda.user) {
        venda.user = removePassword(venda.user);
      }
      return venda;
    });

    res.status(200).json({
      message: "Vendas retrieved successfully",
      vendas: vendasLimpas,
    });
  } catch (error) {
    console.error("Error in /list route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    const vendaId = parseInt(req.params.id, 10);

    if (isNaN(vendaId)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }
    
    const updatedVenda = await prisma.Venda.update({
      where: { id: vendaId },
      data: req.body,
    });

    res.status(200).json({
      message: "Venda updated successfully",
      venda: updatedVenda,
    });
  } catch (error) {
    console.error("Error in /update route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    const vendaId = parseInt(req.params.id, 10);

    if (isNaN(vendaId)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }

    const deletedVenda = await prisma.Venda.delete({
      where: { id: vendaId },
    });

    res.status(200).json({
      message: "Venda deleted successfully",
      user: deletedVenda,
    });
  } catch (error) {
    console.error("Error in /delete route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;