
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

router.get("/list", async (req, res) => {
  try {
    const users = await prisma.user.findMany(); 
    const usersWithoutPassword = users.map(removePassword);

    res.status(200).json({
      message: "Users retrieved successfully",
      users: usersWithoutPassword,
    });
  } catch (error) {
    console.error("Error in /list route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const userOptions = {
  modelName: 'user',
  dataTransformer: removePassword 
};

const userIdOptions = { ...userOptions, idType: 'string' }; 

router.post("/create", createOne(userOptions.modelName, userOptions));
router.put("/update/:id", updateOne(userOptions.modelName, userIdOptions));
router.delete("/delete/:id", deleteOne(userOptions.modelName, userIdOptions));

export default router;