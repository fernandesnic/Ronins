
import express from "express";
import userRoutes from "./user.js";     
import equipeRoutes from "./equipe.js";
import produtoRoutes from "./produto.js";
import trofeuRoutes from "./trofeus.js"; 
import apoiadoresRoutes from "./apoaidores.js"
import jogosRoutes from "./calendario.js"       
import vendasRoutes from "./vendas.js";

import tableManagerRoutes from "./tableManager.js"    

const router = express.Router();

router.use("/", userRoutes);

router.use("/equipe", equipeRoutes);
router.use("/produto", produtoRoutes);
router.use("/trofeus", trofeuRoutes);
router.use("/apoiadores", apoiadoresRoutes);
router.use("/jogos", jogosRoutes);  
router.use("/vendas", vendasRoutes);
router.use("/tablemanager", tableManagerRoutes)

export default router;