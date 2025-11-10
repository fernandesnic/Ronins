
import express from "express";
import equipeRoutes from "./equipe.js"; 

const router = express.Router();

router.use("/equipe", equipeRoutes);

export default router;