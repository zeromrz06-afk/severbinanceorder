import { Spot } from "binance";

const USE_TESTNET = true;
const baseURL = USE_TESTNET ? "https://testnet.binance.vision" : undefined;

export const ALLOWED = new Set(["BTCUSDT", "ETHUSDT"]);

export function getClient() {
  const key = process.env.BINANCE_KEY;
  const secret = process.env.BINANCE_SECRET;
  if (!key || !secret) throw new Error("Missing BINANCE_KEY/SECRET");
  return new Spot(key, secret, { baseURL });
}

export function okCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
}

export function requireKey(req, res) {
  const need = process.env.API_KEY;
  if (!need) return true; // no auth set
  if (req.headers["x-api-key"] === need) return true;
  res.status(401).json({ error: "unauthorized" });
  return false;
}

export function normalizeErr(e) {
  const raw = String(e?.response?.data || e.message || e);
  if (raw.includes("451")) {
    return "Binance บล็อก region ของโฮสต์ (HTTP 451). เปลี่ยน regions ใน vercel.json";
  }
  return raw;
}
