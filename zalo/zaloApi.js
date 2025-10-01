import axios from "axios";

class ZaloApi {
  constructor(appId, secret, codeVerifier) {
    this.appId = appId || process.env.ZALO_APP_ID;
    this.secret = secret || process.env.ZALO_SECRET;
    this.codeVerifier = codeVerifier || process.env.ZALO_CODE_VERIFIER;

    this.ZALO_ACCESS_TOKEN_URL = "https://oauth.zaloapp.com/v4/access_token";
    this.ZALO_INFO_ENDPOINT = "https://graph.zalo.me/v2.0/me/info";

    this.accessToken = null;
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

 async getAccessTokenByCode(code, zaloId, secret, codeVerifier) {
  try {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: secret || this.secret,
    };

    const body = new URLSearchParams({
      code: code,
      code_verifier: codeVerifier || this.codeVerifier, // nhận từ FE
      grant_type: "authorization_code",
      app_id: zaloId || this.appId,
    });

    const rsp = await axios.post(this.ZALO_ACCESS_TOKEN_URL, body, { headers });
    return rsp.data;
  } catch (error) {
    console.error("getAccessTokenByCode error:", error.response?.data || error.message);
    throw error;
  }
}
  async getAccessTokenByRefresh(refreshToken) {
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        secret_key: this.secret,
      };

      const body = new URLSearchParams({
        refresh_token: refreshToken, 
        grant_type: "refresh_token",
        app_id: this.appId,
      });

      const rsp = await axios.post(this.ZALO_ACCESS_TOKEN_URL, body, {
        headers,
      });
      return rsp.data;
    } catch (error) {
      console.error(
        "getAccessTokenByRefresh error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }


  async getPhoneNumber(token, accessToken, secret) {
    try {
      const headers = {
        "Content-Type": "application/json",
        access_token: accessToken, 
        code: token,
        secret_key: secret || this.secret,
      };

      const rsp = await axios.get(this.ZALO_INFO_ENDPOINT, { headers });
      const data = rsp.data;

      if (data && data.error === 0) {
        return data.data.number;
      }
      return null;
    } catch (error) {
      console.error(
        "getPhoneNumber error:",
        error.response?.data || error.message
      );
      return null;
    }
  }
}

export default ZaloApi;
