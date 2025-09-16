import express from "express";
import {
  createPayment,
  webhookHandler,
} from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create-payment", auth, createPayment);

router.post("/webhook", webhookHandler);

export default router;
