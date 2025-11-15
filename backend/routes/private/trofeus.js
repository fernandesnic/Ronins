
import express from "express";
import {
  createOne,
  updateOne,
  deleteOne,
} from "../../controllers/handleFactory.js";

const router = express.Router();

const trofeuOptions = {
  modelName: 'trofeu',
  idType: 'int' 
};

router.post("/create/trofeu", createOne(trofeuOptions.modelName, trofeuOptions));
router.put("/update/trofeu/:id", updateOne(trofeuOptions.modelName, trofeuOptions));
router.delete("/delete/trofeu/:id", deleteOne(trofeuOptions.modelName, trofeuOptions));

export default router;