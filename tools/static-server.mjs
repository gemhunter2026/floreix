import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "site");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname.split("?")[0]);
  const resolved = normalize(join(root, decoded));
  return resolved.startsWith(root) ? resolved : root;
}

createServer(async (request, response) => {
  let file = safePath(new URL(request.url, `http://localhost:${port}`).pathname);
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, "index.html");
  } catch {
    file = join(file, "index.html");
  }

  try {
    await stat(file);
    response.writeHead(200, { "content-type": types[extname(file).toLowerCase()] || "application/octet-stream" });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`Floreix clone running at http://localhost:${port}`);
});
