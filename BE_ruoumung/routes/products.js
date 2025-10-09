import express from "express";
import { getProducts } from "../services/havaran.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await getProducts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;