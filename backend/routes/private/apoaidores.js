
import express from "express";
import {
  createOne,
  updateOne,
  deleteOne,
} from "../../controllers/handleFactory.js";

const router = express.Router();

const apoiadorOptions = {
  modelName: 'apoiador',
  idType: 'int' 
};

router.post("/create/apoiador", createOne(apoiadorOptions.modelName, apoiadorOptions));
router.put("/update/apoiador/:id", updateOne(apoiadorOptions.modelName, apoiadorOptions));
router.delete("/delete/apoiador/:id", deleteOne(apoiadorOptions.modelName, apoiadorOptions));

export default router;