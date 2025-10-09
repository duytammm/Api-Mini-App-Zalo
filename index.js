import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import ZaloApi from "./zalo/zaloApi.js";
import WooService from "./zalo/order.js";
import createPaymentRoutes from "./zalo/payment/paymentRoutes.js";
import purchaseRoutes from "./zalo/purchase.js";
import productRouter from "./BE_ruoumung/routes/products.js"

const app = express();
const zaloApi = new ZaloApi();

const wooService = new WooService({
  baseUrl: process.env.WC_BASE_URL,
  consumerKey: process.env.WC_KEY,
  consumerSecret: process.env.WC_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
// ruou mừng
app.use("/ruoumung/api/products", productRouter);

// Bách hóa lượm lộc
app.use("/zalo/payment", createPaymentRoutes(wooService));

app.use("/sendPurchaseOrder", purchaseRoutes);
app.post("/zalo/token", async (req, res) => {
  try {
    const { code, code_verifier } = req.body;
    if (!code || !code_verifier) {
      return res.status(400).json({ error: "Thiếu code hoặc code_verifier" });
    }

    const tokenData = await zaloApi.getAccessTokenByCode(
      code,
      undefined,
      undefined,
      code_verifier
    );
    const userInfo = await zaloApi.getUserInfo(tokenData.access_token);

    return res.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      user: userInfo,
    });
  } catch (err) {
    console.error("/zalo/token error:", err.response?.data || err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/zalo/userinfo", async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token)
      return res.status(400).json({ error: "Thiếu access_token" });

    const userInfo = await zaloApi.getUserInfo(access_token);
    return res.json({ user: userInfo });
  } catch (err) {
    console.error("/zalo/userinfo error:", err.response?.data || err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/zalo/create-order", async (req, res) => {
  try {
    const orderData = req.body;

    console.log("Received orderData:", orderData);
    const data = await wooService.createOrder(orderData);
    console.log("Woo response:", data);
    res.json(data);
  } catch (err) {
    console.error("/zalo/create-order error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Zalo API running on port ${PORT}`);
});
