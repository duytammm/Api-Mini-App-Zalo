// checkout.js (router)
import express from "express";
import WooService from "./order.js";

const router = express.Router();
const wooService = new WooService({
  baseUrl: "https://bachhoaluomloc.com/wp-json/wc/v3",
  consumerKey: "ck_357283211564ef78e7c712682dc5d19bfd85c69c",
  consumerSecret: "cs_bde583ae75fd0b92fc95688f0e8424dc6dcd3f0f",
});

router.post("/", async (req, res) => {
  try {
    const { orderInfo, cartItems, paymentType } = req.body;

    if (!orderInfo || !cartItems?.length) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
    }
    const wcOrder = await wooService.createOrder({
      payment_method: paymentType === "COD" ? "cod" : "zalopay",
      payment_method_title: paymentType,
      set_paid: false,
      billing: {
        first_name: orderInfo.name,
        address_1: orderInfo.address,
        address_2: orderInfo.ward,
        city: orderInfo.city,
        state: orderInfo.district,
        postcode: "000000",
        country: "VN",
        email: orderInfo.email || "khachhang@example.com",
        phone: orderInfo.phone,
      },
      shipping: {
        first_name: orderInfo.name,
        address_1: orderInfo.address,
        address_2: orderInfo.ward,
        city: orderInfo.city,
        state: orderInfo.district,
        postcode: "000000",
        country: "VN",
      },
      line_items: cartItems.map((i) => ({
        product_id: i.id,
        quantity: i.quantity,
      })),
    });

    res.json({
      success: true,
      wcOrderId: wcOrder.id,
      total: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      paymentMethod: paymentType,
      zpTransToken: paymentType === "ZaloPay" ? "REAL_ZP_TOKEN" : "dummy_token_cod",
    });
  } catch (err) {
    console.error("❌ Backend error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;
