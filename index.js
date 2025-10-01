// index.js
import express from "express";
import cors from "cors";
import ZaloApi from "./zalo/zaloApi.js";

const app = express();
const zaloApi = new ZaloApi();


app.use(cors()); 
app.use(express.json());

app.post("/zalo/token", async (req, res) => {
  try {
    const { code, code_verifier } = req.body;
    if (!code || !code_verifier) {
      return res.status(400).json({ error: "Thiếu code hoặc code_verifier" });
    }


    const tokenData = await zaloApi.getAccessTokenByCode(code, undefined, undefined, code_verifier);


    const userInfo = await zaloApi.getUserInfo(tokenData.access_token);

    return res.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      user: userInfo
    });
  } catch (err) {
    console.error(" /zalo/token error:", err.response?.data || err.message);
    return res.status(500).json({ error: err.message });
  }
});


app.post("/zalo/userinfo", async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ error: "Thiếu access_token" });

    const userInfo = await zaloApi.getUserInfo(access_token);

    return res.json({ user: userInfo });
  } catch (err) {
    console.error("/zalo/userinfo error:", err.response?.data || err.message);
    return res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Zalo API running on port ${PORT}`);
});
