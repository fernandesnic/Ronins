
import express, { Router } from "express";
import equipeRoutes from "./equipe.js"; 
import trofeuRoutes from "./trofeus.js"; 
import produtoRoutes from "./produto.js"

const router = express.Router();

router.use("/equipe", equipeRoutes);
router.use("/trofeus", trofeuRoutes);

router.use("/produto", produtoRoutes)


export default router;