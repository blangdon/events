// Proxy between the site and JSONBin, so the JSONBin key stays in Netlify's
// environment variables and never reaches the browser.
//
// Netlify → Site configuration → Environment variables:
//   JSONBIN_BIN_ID      the bin's ID
//   JSONBIN_ACCESS_KEY  an Access Key with Bins: Read + Update
//   (or JSONBIN_MASTER_KEY instead of the access key)

const MAX_BYTES = 500_000;

export default async (req) => {
  const binId = Netlify.env.get("JSONBIN_BIN_ID");
  const accessKey = Netlify.env.get("JSONBIN_ACCESS_KEY");
  const masterKey = Netlify.env.get("JSONBIN_MASTER_KEY");
  if (!binId || !(accessKey || masterKey)) {
    return json({ error: "not_configured" }, 503);
  }

  const url = `https://api.jsonbin.io/v3/b/${encodeURIComponent(binId)}`;
  const headers = { "Content-Type": "application/json", "X-Bin-Meta": "false" };
  if (accessKey) headers["X-Access-Key"] = accessKey;
  else headers["X-Master-Key"] = masterKey;

  if (req.method === "GET") {
    const r = await fetch(`${url}/latest`, { headers });
    const body = await r.text();
    return new Response(body, { status: r.status, headers: noStore() });
  }

  if (req.method === "PUT") {
    const text = await req.text();
    if (text.length > MAX_BYTES) return json({ error: "too_large" }, 413);
    let rec;
    try { rec = JSON.parse(text); } catch { return json({ error: "bad_json" }, 400); }
    const ok = rec && typeof rec === "object" && !Array.isArray(rec)
      && (rec.events === undefined || Array.isArray(rec.events))
      && (rec.prefs === undefined || (typeof rec.prefs === "object" && !Array.isArray(rec.prefs)));
    if (!ok) return json({ error: "bad_shape" }, 400);
    const r = await fetch(url, { method: "PUT", headers, body: JSON.stringify(rec) });
    return new Response(await r.text(), { status: r.status, headers: noStore() });
  }

  return json({ error: "method_not_allowed" }, 405);
};

const noStore = () => ({ "Content-Type": "application/json", "Cache-Control": "no-store" });
const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: noStore() });

export const config = { path: "/api/bin" };
