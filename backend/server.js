import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js"
import auth from "./middlewares/auth.js";
import cors from "cors";

const allowedOrigins = [
  'https://ronins-omega.vercel.app/', // 1. Sua URL de produção
  'http://localhost:5500',                  // 2. Sua URL de dev (ajuste a porta se for diferente)
  'http://127.0.0.1:5500'                   // 3. (Opcional) Às vezes o Live Server usa 127.0.0.1
];

const corsOptions = {
  origin: function (origin, callback) {
    // Se a origem da requisição ESTÁ na lista (ou se for 'undefined' - ex: Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Permite
    } else {
      callback(new Error('Não permitido pelo CORS')); // Bloqueia
    }
  }
};
app.use(cors(corsOptions));

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

app.use("/api/public", publicRoutes);
app.use("/api/private", auth, privateRoutes)

app.listen(PORT, () => console.log("Server is running on port", PORT));
