import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(err));

app.use("/api", paymentRoutes);
app.use("/api", userRoutes);
app.use("/api", transactionsRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server is listening at port: `, PORT);
});
