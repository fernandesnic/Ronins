import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Função auxiliar para remover a senha de um objeto de usuário
const removePassword = (user) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};


router.get("/list", async (req, res) => {
  try {
    const users = await prisma.User.findMany();

    const usersWithoutPassword = users.map((user) => {
      // Corrigido de 'senha' para 'password'
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      message: "Users retrieved successfully",
      users: usersWithoutPassword,
    });
  } catch (error) {
    console.error("Error in /list route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await prisma.User.update({
      where: { id: id },
      data: req.body,
    });
    res.status(200).json({
      message: "User updated successfully",
      user: removePassword(updatedUser),
    });
  } catch (error) {
    console.error("Error in /update route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.User.delete({
      where: { id },
    });
    res.status(200).json({
      message: "User deleted successfully",
      user: removePassword(deletedUser),
    });
  } catch (error) {
    console.error("Error in /delete route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;