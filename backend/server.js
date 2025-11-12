import express from "express";
import publicRoutes from "./routes/public/public.js";
import privateRoutes from "./routes/private/private.js"
import vendasRoutes from "./routes/private/vendas.js";
import authRoutes from "./routes/auth.js"
import auth from "./middlewares/auth.js";
import cors from "cors";

// --- 1. INICIALIZAR O APP ---
// 'app' deve ser criado antes de ser usado.
const app = express();
const PORT = 3000;

// --- 2. CONFIGURAR O CORS ---
const allowedOrigins = [
  'https://ronins-omega.vercel.app', 
  'http://localhost:5500',           
  'http://127.0.0.1:5500',
  'http://localhost:3333',
  'http://127.0.0.1:3333'    
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); 
    } else {
      callback(new Error('Não permitido pelo CORS')); 
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/vendas", auth, vendasRoutes) 
app.use("/api/private", auth, privateRoutes)

app.listen(PORT, () => console.log("Server is running on port", PORT));