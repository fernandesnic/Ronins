
import express from "express";
import {
  createOne,
  updateOne,
  deleteOne,
} from "../../controllers/handleFactory.js";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

const produtoOptions = {
  modelName: 'ContatoMsg',
  idType: 'int' 
};

router.get("/list", async (req, res) => {
  try {
    const messages = await prisma.contatoMsg.findMany(); 

    res.status(200).json({
      message: "Messages retrieved successfully",
      messages
    });
  } catch (error) {
    console.error("Error in /mensagens/list route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.post("/create/mensagem", createOne(produtoOptions.modelName, produtoOptions));
router.put("/update/mensagem/:id", updateOne(produtoOptions.modelName, produtoOptions));
router.delete("/delete/mensagem/:id", deleteOne(produtoOptions.modelName, produtoOptions));

export default router;