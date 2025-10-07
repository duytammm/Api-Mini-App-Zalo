import express from "express";
import CryptoJS from "crypto-js";

const router = express.Router();

const PRIVATE_KEY = "bd3387dca235f473eafbc92805e6d296";

router.post("/", (req, res) => {
  const { appId, orderId, resultCode, mac } = req.body;

  if (!appId || !orderId || !resultCode || !mac) {
    return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
  }

  const data = `appId=${appId}&orderId=${orderId}&resultCode=${resultCode}&privateKey=${PRIVATE_KEY}`;
  const generatedMac = CryptoJS.HmacSHA256(data, PRIVATE_KEY).toString(CryptoJS.enc.Hex);

  if (generatedMac !== mac) {
    return res.status(400).json({ success: false, message: "MAC không hợp lệ" });
  }

  console.log("Thanh toán hợp lệ:", { appId, orderId, resultCode });

  return res.json({
    success: true,
    message: "Thanh toán thành công",
    data: { appId, orderId, resultCode },
  });
});

export default router;
