export default class CODPayment {
  constructor(wooService) {
    this.wooService = wooService;
  }
  async createOrderCOD(orderData) {
    try {
      const newOrder = await this.wooService.createOrder({
        ...orderData,
        payment_method: "cod",
        payment_method_title: "Thanh toán khi nhận hàng",
      });
      return {
        success: true,
        message: "Đơn hàng COD đã được tạo thành công",
        order: newOrder,
      };
    } catch (err) {
      console.error("CODPayment.createOrderCOD error:", err.message);
      return { success: false, error: err.message };
    }
  }
  async handleZaloNotify(payload) {
    try {
      console.log("Zalo notify payload", payload);
      return { success: true };
    } catch (err) {
      console.error("handleZaloNotify error:", err.message);
      return { success: false, error: err.message };
    }
  }
}
