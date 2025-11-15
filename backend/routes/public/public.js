
import express from "express";
import equipeRoutes from "./equipe.js"; 
import trofeuRoutes from "./trofeus.js"; 
import produtoRoutes from "./produto.js"
import apoiadoresRoutes from "./apoiadores.js"
import jogosRoutes from "./calendario.js"
import produtoDetalheRoutes from "./produtoDetalhe.js"


const router = express.Router();

router.use("/equipe", equipeRoutes);
router.use("/trofeus", trofeuRoutes);
router.use("/apoiadores", apoiadoresRoutes);
router.use("/jogos", jogosRoutes);
router.use("/produto", produtoRoutes)
router.use("/produto/:id", produtoDetalheRoutes)




export default router;