
import express from "express";
import userRoutes from "./user.js";     
import equipeRoutes from "./equipe.js";
import produtoRoutes from "./produto.js";
import tableManagerRoutes from "./tableManager.js"    

const router = express.Router();

router.use("/", userRoutes);

router.use("/equipe", equipeRoutes);
router.use("/produto", produtoRoutes);
router.use("/tablemanager", tableManagerRoutes)

export default router;