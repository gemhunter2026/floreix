import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { dirname, join, posix } from "node:path";
import { pipeline } from "node:stream/promises";

const ORIGIN = "https://floreix.com";
const OUT = join(process.cwd(), "site");
const seen = new Set();
const pages = [
  "/",
  "/booking/",
  "/booking-my-account/",
  "/thank-you-for-booking/",
  "/privacy-policy/",
  "/es/terminos-y-condiciones/",
  "/es/metodologia-2/",
  "/metodologia/",
  "/es/contacto/",
  "/es/elementor-1816/",
  "/contact/",
  "/es/sobre-nosotros/",
  "/about/",
  "/es/psicoterapia-2/",
  "/es/terapia-en-la-naturaleza/",
  "/es/2084-2/",
  "/psicoterapia/",
  "/terapia-a-la-natura/",
  "/hello-world/",
];

const assetExtensions = new Set([
  ".css",
  ".js",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".gif",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".json",
]);

function cleanUrl(raw, base = ORIGIN) {
  if (!raw || raw.startsWith("data:") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("#")) {
    return null;
  }

  const decoded = raw.replaceAll("&amp;", "&").replaceAll("&#038;", "&").replaceAll("&#039;", "'");
  try {
    const url = new URL(decoded, base);
    if (url.hostname === "www.floreix.com") url.hostname = "floreix.com";
    return url;
  } catch {
    return null;
  }
}

function localPathForUrl(url, isPage = false) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  if (isPage && !posix.extname(pathname)) pathname = posix.join(pathname, "index.html");
  return join(OUT, pathname.replace(/^\/+/, ""));
}

function rootRelative(url, isPage = false) {
  if (url.origin !== ORIGIN) return url.href;
  let pathname = url.pathname;
  if (isPage && !pathname.endsWith("/") && !posix.extname(pathname)) pathname += "/";
  return pathname + (url.hash || "");
}

async function download(url, isPage = false) {
  const key = `${isPage ? "page" : "asset"}:${url.href.split("#")[0]}`;
  if (seen.has(key)) return null;
  seen.add(key);

  const target = localPathForUrl(url, isPage);
  await mkdir(dirname(target), { recursive: true });

  const response = await fetch(url.href, {
    headers: { "user-agent": "Codex static mirror for site owner" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url.href}`);

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/") || contentType.includes("javascript") || contentType.includes("json") || isPage) {
    const text = await response.text();
    await writeFile(target, isPage ? rewriteHtml(text, url) : rewriteTextUrls(text, url), "utf8");
    return await readFile(target, "utf8");
  }

  await pipeline(response.body, createWriteStream(target));
  return null;
}

function discoverUrls(text, baseUrl) {
  const urls = new Set();
  const patterns = [
    /\b(?:src|href|poster)=["']([^"']+)["']/gi,
    /\bsrcset=["']([^"']+)["']/gi,
    /url\((['"]?)([^)'"]+)\1\)/gi,
    /["'](https?:\/\/(?:www\.)?floreix\.com\/[^"']+)["']/gi,
    /["']([^"']+\.bundle\.min\.js)["']/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text))) {
      const value = match[2] || match[1];
      if (!value) continue;
      if (pattern.source.includes("srcset")) {
        value.split(",").forEach((part) => {
          const candidate = cleanUrl(part.trim().split(/\s+/)[0], baseUrl.href);
          if (candidate) urls.add(candidate.href);
        });
      } else {
        const candidate = cleanUrl(value, baseUrl.href);
        if (candidate) urls.add(candidate.href);
      }
    }
  }

  return [...urls].map((href) => new URL(href));
}

function rewriteTextUrls(text, baseUrl) {
  return text
    .replaceAll("https:\\/\\/www.floreix.com", "")
    .replaceAll("https:\\/\\/floreix.com", "")
    .replaceAll("http:\\/\\/floreix.com", "")
    .replaceAll("https://www.floreix.com", "")
    .replaceAll("https://floreix.com", "")
    .replaceAll("http://floreix.com", "");
}

function rewriteHtml(html, baseUrl) {
  return rewriteTextUrls(html, baseUrl)
    .replace(/href=["']\/feed\/["']/g, 'href="/"')
    .replace(/href=["']\/comments\/feed\/["']/g, 'href="/"')
    .replace(/href=["']\/es\/feed\/["']/g, 'href="/es/elementor-1816/"')
    .replace(/href=["']\/es\/comments\/feed\/["']/g, 'href="/es/elementor-1816/"')
    .replace(/href=["']\/wp-json\/["']/g, 'href="/"')
    .replace(/href=["']\/wp-json\/[^"']+["']/g, 'href="/"')
    .replace(/href=["']\/xmlrpc\.php\?rsd["']/g, 'href="/"')
    .replace(/action=["']\/wp-admin\/admin-ajax\.php["']/g, 'action="#"')
    .replace(/ajaxurl":"\/wp-admin\/admin-ajax\.php"/g, 'ajaxurl":"#"')
    .replace(/ajax_url":"\/wp-admin\/admin-ajax\.php"/g, 'ajax_url":"#"');
}

function shouldDownloadAsset(url) {
  if (url.origin !== ORIGIN) return false;
  const ext = posix.extname(url.pathname).toLowerCase();
  return assetExtensions.has(ext) || url.pathname.startsWith("/wp-content/") || url.pathname.startsWith("/wp-includes/");
}

async function mirror() {
  await mkdir(OUT, { recursive: true });
  const queue = [];

  for (const page of pages) {
    const url = new URL(page, ORIGIN);
    console.log(`page ${url.pathname}`);
    const html = await download(url, true);
    if (html) queue.push(...discoverUrls(html, url).filter(shouldDownloadAsset));
  }

  for (let i = 0; i < queue.length; i++) {
    const url = queue[i];
    const before = seen.size;
    try {
      const text = await download(url, false);
      if (text) {
        queue.push(...discoverUrls(text, url).filter(shouldDownloadAsset));
      }
      if (seen.size > before) console.log(`asset ${url.pathname}`);
    } catch (error) {
      console.warn(`skip ${url.href}: ${error.message}`);
    }
  }

  await writeFile(
    join(OUT, "README.md"),
    "# Floreix static clone\n\nServe this folder from a local web server so root-relative WordPress asset paths resolve correctly.\n\nExample:\n\n```powershell\npython -m http.server 4173 -d site\n```\n",
    "utf8",
  );
}

mirror().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
