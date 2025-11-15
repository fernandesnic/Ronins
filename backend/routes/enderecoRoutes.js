import express from "express";
import {
    createMeuEndereco,
  getMeusEnderecos,
  updateMeuEndereco,
  deleteMeuEndereco,
} from "../controllers/enderecoController.js"

import auth from "../middlewares/auth.js"

const router = express.Router();

router.use(auth);

router
.route("/")
.post(createMeuEndereco)
.get(getMeusEnderecos)

router 
.route("/:id")
.put(updateMeuEndereco)
.delete(deleteMeuEndereco)

export default router;
