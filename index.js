// server.js
const express = require("express");
const request = require("request");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.ZALO_APP_ID;
const APP_SECRET = process.env.ZALO_APP_SECRET;
const REDIRECT_URI = process.env.ZALO_REDIRECT_URI;

const ZALO_OAUTH_TOKEN_URL = "https://oauth.zaloapp.com/v4/access_token";
const API_DOMAIN = "https://graph.zalo.me";

app.post("/zalo/token", (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Thiếu code" });

  request.post(
    {
      url: ZALO_OAUTH_TOKEN_URL,
      qs: {
        app_id: APP_ID,
        app_secret: APP_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      },
      json: true,
    },
    (err, response, body) => {
      if (err) return res.status(500).json({ error: true, message: err.message });
      return res.json(body);
    }
  );
});

app.post("/zalo/userinfo", async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: "Thiếu access_token" });

  const getZaloProfile = () =>
    new Promise((resolve, reject) => {
      request(
        {
          url: `${API_DOMAIN}/v2.0/me`,
          method: "GET",
          qs: {
            access_token,
            fields: "id,name,picture",
          },
          json: true,
        },
        (err, response, body) => {
          if (err) return reject(err);
          resolve(body);
        }
      );
    });

  const getZaloPhone = () =>
    new Promise((resolve, reject) => {
      request(
        {
          url: `${API_DOMAIN}/v2.0/me/phone`,
          method: "GET",
          qs: { access_token },
          json: true,
        },
        (err, response, body) => {
          if (err) return reject(err);
          resolve(body);
        }
      );
    });

  try {
    const user = await getZaloProfile();
    let phone = null;
    try {
      phone = await getZaloPhone();
    } catch (err) {
      phone = { error: err.message };
    }

    return res.json({ error: 0, user, phone });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
});

app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
