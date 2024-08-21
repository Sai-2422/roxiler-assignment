import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

const configPath = path.resolve("config", "uat.env");
dotenv.config({ path: configPath });
import transactionRoutes from "./features/transaction/routes/transaction.routes.js"


const app = express();
app.use(
  cors({
    origin: '*', // Or specify your domain
    credentials: true,
  })
);

app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to NodeJs App");
});

app.use('/api/roxiler/transaction', transactionRoutes);

export default app;