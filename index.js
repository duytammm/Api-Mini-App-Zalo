import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const APP_SECRET = process.env.ZALO_APP_SECRET || "<your_zalo_app_secret_key>";

app.post("/get-zalo-user", async (req, res) => {
  const { accessToken, phoneToken } = req.body;

  if (!accessToken || !phoneToken) {
    return res.status(400).json({ error: "Missing accessToken or phoneToken" });
  }

  try {
    const profileRes = await axios.get("https://graph.zalo.me/v2.0/me", {
      params: {
        access_token: accessToken,
        fields: "id,name,picture"
      }
    });

    const zaloProfile = profileRes.data; 

    const phoneRes = await axios.get("https://graph.zalo.me/v2.0/me/info", {
      headers: {
        access_token: accessToken,
        code: phoneToken,
        secret_key: APP_SECRET,
      },
    });

    const phone = phoneRes.data.data?.number || null;
    res.json({
      data: {
        id: zaloProfile.id,
        name: zaloProfile.name,
        avatar: zaloProfile.picture?.data?.url || null,
        phone,
      },
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch zalo user info",
      details: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
