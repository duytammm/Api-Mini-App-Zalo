// order.js (WooService)
import fetch from "node-fetch";

class WooService {
  constructor({ baseUrl, consumerKey, consumerSecret }) {
    this.baseUrl = baseUrl;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
  }

  async createOrder(orderData) {
    try {
      const res = await fetch(`${this.baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64"),
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok || data.code) throw new Error(data.message || "WooCommerce error");
      return data;
    } catch (err) {
      console.error("WooService.createOrder error:", err.message);
      throw err;
    }
  }
}

export default WooService;
