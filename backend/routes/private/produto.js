
import express from "express";
import {
  createOne,
  updateOne,
  deleteOne,
} from "../../controllers/handleFactory.js";

const router = express.Router();

const produtoOptions = {
  modelName: 'produto',
  idType: 'int' 
};

router.post("/create/produto", createOne(produtoOptions.modelName, produtoOptions));
router.put("/update/produto/:id", updateOne(produtoOptions.modelName, produtoOptions));
router.delete("/delete/produto/:id", deleteOne(produtoOptions.modelName, produtoOptions));

export default router;