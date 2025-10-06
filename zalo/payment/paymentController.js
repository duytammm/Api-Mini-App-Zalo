import CODPayment from "./cod.js";

export default class PaymentController {
  constructor(wooService) {
    this.codPayment = new CODPayment(wooService);
  }
  createCODOrder = async (req, res) => {
    try {
      const result = await this.codPayment.createOrderCOD(req.body);
      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }
      res.json(result);
    } catch (err) {
      console.error("createCODOrder error:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  zaloNotify = async (req, res) => {
    try {
      const result = await this.codPayment.handleZaloNotify(req.body);
      res.json(result);
    } catch (err) {
      console.error("zaloNotify error:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
}
