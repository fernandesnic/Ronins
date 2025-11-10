
import express from "express";
import userRoutes from "./user.js";     
import equipeRoutes from "./equipe.js";
import produtoRoutes from "./produto.js";      

const router = express.Router();

router.use("/", userRoutes);

router.use("/equipe", equipeRoutes);
router.use("/produto", produtoRoutes);

export default router;