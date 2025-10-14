import fetch from "node-fetch";

class WooService {
  constructor({ baseUrl, consumerKey, consumerSecret }) {
    this.baseUrl = baseUrl;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
  }

  // Tạo đơn hàng WooCommerce
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

      if (!res.ok) {
        throw new Error(data.message || "Tạo đơn hàng thất bại");
      }

      return data;
    } catch (error) {
      console.error("WooService.createOrder error:", error.message);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng WooCommerce
  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64"),
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update WC order failed");
      return data;
    } catch (err) {
      console.error("WooService.updateOrderStatus error:", err.message);
      throw err;
    }
  }
}

export default WooService;
