import express from "express";
import ZaloApi from "./zalo/zaloApi";

const app = express();
app.use(express.json);

const zaloApi = new ZaloApi();

app.post("/zalo/token", async (req, res) => {
  try {
    const { code } = req.body;
    const data = await zaloApi.getAccessTokenByCode(code);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/zalo/userinfo", async (req, res) => {
  try {
    const { phoneToken, accessToken } = req.body;
    const phone = await zaloApi.getPhoneNumber(phoneToken, accessToken);

    return res.json({ phone });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.listen(3000, () => console.log("Zalo Api running on port 3000"));
