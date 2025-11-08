import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/list", async (req, res) => {
  try {
    const users = await prisma.User.findMany();

    const usersWithoutPassword = users.map((user) => {
      const { senha, ...userSemSenha } = user;
      return userSemSenha;
    });

    res
      .status(200)
      .json({ message: "Users retrieved successfully", users: usersWithoutPassword });
  } catch (error) {
    console.error("Error in /list route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update/:id", async (req, res) => {
  try { 
    let { id } = req.params; 
    

    const updatedUser = await prisma.User.update({
      where: { id: id },
      data: req.body,
    });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error in /update route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.delete("/delete/:id", async (req, res) => {
  try {
 const { id } = req.params;
 const deletedUser = await prisma.User.delete({
  where: { id }
 })
 res.status(200).json({message: "User deleted successfully", user: deletedUser})
} catch (error) {
  console.error("Error in /delete route:", error);
res.status(500).json({ error: "Internal Server Error" });
}
})
export default router;