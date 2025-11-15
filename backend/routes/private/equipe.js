
import express from "express";
import {
  createOne,
  updateOne,
  deleteOne,
} from "../../controllers/handleFactory.js";

const router = express.Router();

const jogadorOptions = {
  modelName: 'jogador',
  idType: 'int' 
};

const staffOptions = {
  modelName: 'staff',
  idType: 'int' 
};

const premiacaoOptions = {
  modelName: 'premiacao',
  idType: 'int' 
}

router.post("/create/jogador", createOne(jogadorOptions.modelName, jogadorOptions));
router.put("/update/jogador/:id", updateOne(jogadorOptions.modelName, jogadorOptions));
router.delete("/delete/jogador/:id", deleteOne(jogadorOptions.modelName, jogadorOptions));


router.post("/create/staff", createOne(staffOptions.modelName, staffOptions));
router.put("/update/staff/:id", updateOne(staffOptions.modelName, staffOptions));
router.delete("/delete/staff/:id", deleteOne(staffOptions.modelName, staffOptions));


router.post("/create/premiacao", createOne(premiacaoOptions.modelName, premiacaoOptions));
router.post("/update/premiacao/:id", updateOne(premiacaoOptions.modelName, premiacaoOptions));
router.delete("/delete/premiacao/:id", deleteOne(premiacaoOptions.modelName, premiacaoOptions));

export default router;