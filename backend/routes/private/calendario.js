
import express from "express";
import {
  createOne,
  updateOne,
  deleteOne,
} from "../../controllers/handleFactory.js";

const router = express.Router();

const jogosOptions = {
  modelName: 'jogos',
  idType: 'int' 
};

router.post("/create/jogos", createOne(jogosOptions.modelName, jogosOptions));
router.put("/update/jogos/:id", updateOne(jogosOptions.modelName, jogosOptions));
router.delete("/delete/jogos/:id", deleteOne(jogosOptions.modelName, jogosOptions));

export default router;