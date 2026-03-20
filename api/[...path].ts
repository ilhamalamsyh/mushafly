import { VercelRequest, VercelResponse } from "@vercel/node";

const TARGET = "https://equran.id/api/v2";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  // Get path from URL
  const path = new URL(req.url ?? "", "http://localhost").pathname.replace(
    /^\/api/,
    "",
  );
  const queryString = new URL(req.url ?? "", "http://localhost").search;
  const upstreamUrl = `${TARGET}${path}${queryString}`;

  try {
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({
      code: 500,
      message: "Proxy error",
    });
  }
}
