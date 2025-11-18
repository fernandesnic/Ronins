
import express from "express";
import {
  createOne,
  updateOne,
  deleteOne,
} from "../../controllers/handleFactory.js";

const router = express.Router();

const produtoOptions = {
  modelName: 'ContatoMsg',
  idType: 'int' 
};

router.post("/create/mensagem", createOne(produtoOptions.modelName, produtoOptions));
router.put("/update/mensagem/:id", updateOne(produtoOptions.modelName, produtoOptions));
router.delete("/delete/mensagem/:id", deleteOne(produtoOptions.modelName, produtoOptions));

export default router;