import express from "express";
import { PrismaClient } from "@prisma/client";


import {
  createOne,
  updateOne,
  deleteOne,
  removePassword, 
} from "../../controllers/handleFactory.js";

const router = express.Router();
const prisma = new PrismaClient(); 

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

const vendaOptions = { idType: 'int' };


router.post("/create", createOne('Venda', vendaOptions));
router.put("/update/:id", updateOne('Venda', vendaOptions));
router.delete("/delete/:id", deleteOne('Venda', vendaOptions));

export default router;