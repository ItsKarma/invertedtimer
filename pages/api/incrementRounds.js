import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    const date = new Date().toISOString().split("T")[0];
    await kv.incr(date);
    res.status(200).json({ message: "Session incremented successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to increment session" });
  }
}
