import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./Models/db.js";
import cors from "cors";
import AuthRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./Routes/admin.routes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Frontend URL
    credentials: true, // Allows cookies to be sent
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/auth", AuthRouter);
app.use("/admin", adminRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err.message);
  });
