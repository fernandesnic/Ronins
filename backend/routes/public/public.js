
import express from "express";
import equipeRoutes from "./equipe.js"; 
import trofeuRoutes from "./trofeus.js"; 

const router = express.Router();

router.use("/equipe", equipeRoutes);
router.use("/trofeus", trofeuRoutes);


export default router;