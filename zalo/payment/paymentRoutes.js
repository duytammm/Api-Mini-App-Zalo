import express from "express";
import PaymentController from "./paymentController.js";

export default function createPaymentRoutes(wooService) {
  const router = express.Router();
  const paymentController = new PaymentController(wooService);

  router.post("/cod", paymentController.createCODOrder);
  router.post("/notify", paymentController.zaloNotify);

  return router;
}
