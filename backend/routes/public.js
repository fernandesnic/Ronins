import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Validação da variável de ambiente JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1); // Encerra a aplicação se a variável não estiver definida
}

// Cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(user.password, salt);

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        nome: user.nome, 
        password: passwordHash,
      },
      
      select: {
        id: true,
        email: true,
        nome: true,
        is_admin: true,
        is_socio: true,
      },
    });
    res.status(201).json(userDB);
  } catch (error) {
    // Tratamento específico para erro de e-mail duplicado
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Código de erro do Prisma para violação de constraint única
        return res.status(409).json({ error: 'Este e-mail já está em uso.' });
      }
    }

    // Log do erro no servidor para depuração
    console.error("Erro na rota /cadastro:", error);

    // Resposta genérica para o cliente
    res.status(500).json({ error: "Não foi possível processar o cadastro." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      // Mensagem genérica para evitar enumeração de usuários
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const isMatch = await bcrypt.compare(userInfo.password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro na rota /login:", error);
    res.status(500).json({ error: "Não foi possível processar o login." });
  }
});

export default router;
