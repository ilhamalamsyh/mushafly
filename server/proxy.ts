const TARGET = "https://equran.id/api/v2";
const PORT = Number(process.env.PROXY_PORT ?? 8787);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (!url.pathname.startsWith("/api/")) {
      return new Response("Not Found", { status: 404, headers: corsHeaders });
    }

    const upstreamPath = url.pathname.replace(/^\/api/, "");
    const upstreamUrl = `${TARGET}${upstreamPath}${url.search}`;

    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  },
});

console.log(`Quran proxy listening on http://localhost:${PORT}`);
