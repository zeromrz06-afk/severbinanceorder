const Binance = require("binance");
const Spot = Binance.Spot;

const USE_TESTNET = true;
const baseURL = USE_TESTNET ? "https://testnet.binance.vision" : undefined;

const ALLOWED = new Set(["BTCUSDT", "ETHUSDT"]);

function getClient() {
  const key = process.env.BINANCE_KEY;
  const secret = process.env.BINANCE_SECRET;
  if (!key || !secret) throw new Error("Missing BINANCE_KEY/SECRET");
  return new Spot(key, secret, { baseURL });
}

function okCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
  res.setHeader("Content-Type", "application/json");
}

function requireKey(req, res) {
  const need = process.env.API_KEY;
  if (!need) return true; // no auth set
  if (req.headers["x-api-key"] === need) return true;
  res.status(401).json({ error: "unauthorized" });
  return false;
}

function normalizeErr(e) {
  const raw = String(e?.response?.data || e.message || e);
  if (raw.includes("451")) {
    return "Binance บล็อก region ของโฮสต์ (HTTP 451). เปลี่ยน regions ใน vercel.json";
  }
  return raw;
}

module.exports = { ALLOWED, getClient, okCors, requireKey, normalizeErr };
