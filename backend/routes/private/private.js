
import express from "express";
import userRoutes from "./user.js";     
import equipeRoutes from "./equipe.js";   

const router = express.Router();

router.use("/", userRoutes);

router.use("/equipe", equipeRoutes);

export default router;