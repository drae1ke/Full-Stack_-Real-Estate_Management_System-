const https = require("https");

const DARAJA_BASE_URL =
  process.env.DARAJA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
const IS_PRODUCTION_DARAJA = process.env.DARAJA_ENV === "production";

const CONSUMER_KEY = process.env.DARAJA_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.DARAJA_CONSUMER_SECRET || "";
const SHORTCODE = process.env.DARAJA_SHORTCODE || "174379";
const PASSKEY =
  process.env.DARAJA_PASSKEY ||
  "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const APP_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  ""
).replace(/\/$/, "");
const CALLBACK_URL =
  process.env.DARAJA_CALLBACK_URL ||
  (APP_BASE_URL ? `${APP_BASE_URL}/rental/mpesa/callback` : "");

let _tokenCache = { token: null, expiresAt: 0 };

function validateDarajaConfig() {
  const missing = [];

  if (!CONSUMER_KEY) missing.push("DARAJA_CONSUMER_KEY");
  if (!CONSUMER_SECRET) missing.push("DARAJA_CONSUMER_SECRET");
  if (!SHORTCODE || (IS_PRODUCTION_DARAJA && !process.env.DARAJA_SHORTCODE)) {
    missing.push("DARAJA_SHORTCODE");
  }
  if (!PASSKEY || (IS_PRODUCTION_DARAJA && !process.env.DARAJA_PASSKEY)) {
    missing.push("DARAJA_PASSKEY");
  }
  if (!CALLBACK_URL) missing.push("DARAJA_CALLBACK_URL or API_BASE_URL");

  if (missing.length) {
    throw new Error(`M-Pesa is not configured. Set ${missing.join(", ")} on the backend.`);
  }

  try {
    const callback = new URL(CALLBACK_URL);

    if (callback.protocol !== "https:") {
      throw new Error("Callback URL must use HTTPS.");
    }
  } catch {
    throw new Error("M-Pesa callback URL must be a valid HTTPS URL.");
  }
}

async function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(
        typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body)
      );
    }

    req.end();
  });
}

async function getAccessToken() {
  validateDarajaConfig();

  if (_tokenCache.token && Date.now() < _tokenCache.expiresAt) {
    return _tokenCache.token;
  }

  const credentials = Buffer.from(
    `${CONSUMER_KEY}:${CONSUMER_SECRET}`
  ).toString("base64");

  const result = await fetchJson(
    `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  if (!result.body.access_token) {
    throw new Error(`Daraja auth failed: ${JSON.stringify(result.body)}`);
  }

  _tokenCache = {
    token: result.body.access_token,
    expiresAt: Date.now() + (Number(result.body.expires_in) - 60) * 1000,
  };

  return _tokenCache.token;
}

function buildTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

function buildPassword(timestamp) {
  return Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");
}

function normalizePhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }
  if (digits.startsWith("254")) {
    return digits;
  }
  if (digits.startsWith("7") || digits.startsWith("1")) {
    return `254${digits}`;
  }
  return digits;
}

async function initiateSTKPush({ phone, amount, accountReference, description }) {
  const token = await getAccessToken();
  const timestamp = buildTimestamp();
  const password = buildPassword(timestamp);
  const normalizedPhone = normalizePhone(phone);

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.ceil(Number(amount)),
    PartyA: normalizedPhone,
    PartyB: SHORTCODE,
    PhoneNumber: normalizedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: String(accountReference).slice(0, 12),
    TransactionDesc: String(description).slice(0, 13),
  };

  const result = await fetchJson(
    `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    }
  );

  return result.body;
}

module.exports = { initiateSTKPush, normalizePhone };
