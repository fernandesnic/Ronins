// Arquivo: routes/public/contato.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const novaMensagem = await prisma.contatoMsg.create({
      data: {
        nome: name,
        email: email,
        mensagem: message,
      },
    });

    res.status(201).json({ message: "Mensagem salva com sucesso!" });

  } catch (error) {
    next(error);
  }
});

export default router;