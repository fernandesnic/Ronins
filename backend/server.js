import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js"
import auth from "./middlewares/auth.js";
import cors from "cors";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

app.use("/api/public", publicRoutes);
app.use("/api/private", auth, privateRoutes)

app.listen(PORT, () => console.log("Server is running on port", PORT));
