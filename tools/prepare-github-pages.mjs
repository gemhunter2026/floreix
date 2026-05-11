import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { readdirSync, statSync } from "node:fs";

const root = process.cwd();
const source = join(root, "site");
const basePath = process.env.GITHUB_PAGES_BASE_PATH || "/floreix";

const generatedTargets = [
  "about",
  "booking",
  "booking-my-account",
  "contact",
  "es",
  "hello-world",
  "metodologia",
  "privacy-policy",
  "psicoterapia",
  "terapia-a-la-natura",
  "thank-you-for-booking",
  "wp-content",
  "wp-includes",
  "index.html",
  ".nojekyll",
];

const textExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".json",
  ".svg",
  ".txt",
  ".xml",
]);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

function toRelativeFromRoot(file) {
  return file.slice(root.length + 1).replaceAll("\\", "/");
}

function prefixRootRelativeUrls(text) {
  let output = text;
  const attrs = ["href", "src", "action", "poster"];

  for (const attr of attrs) {
    output = output.replace(
      new RegExp(`\\b${attr}=(["'])/(?!/|${basePath.slice(1)}(?:/|["'#?]))([^"'#?]*)([?#][^"']*)?\\1`, "g"),
      (_match, quote, path, suffix = "") => `${attr}=${quote}${basePath}/${path}${suffix}${quote}`,
    );
  }

  output = output.replace(
    /url\((['"]?)\/(?!\/|floreix(?:\/|['")]))([^)'"]+)\1\)/g,
    (_match, quote, path) => `url(${quote}${basePath}/${path}${quote})`,
  );

  output = output.replace(
    /(["'])\/(wp-content|wp-includes|about|booking|booking-my-account|contact|es|hello-world|metodologia|privacy-policy|psicoterapia|terapia-a-la-natura|thank-you-for-booking)(\/[^"']*)?\1/g,
    (_match, quote, path, rest = "") => `${quote}${basePath}/${path}${rest}${quote}`,
  );

  output = output
    .replace(new RegExp(`${basePath}/(?:[^"'\\s]+/)?feed/`, "g"), `${basePath}/`)
    .replace(new RegExp(`${basePath}/(?:[^"'\\s]+/)?comments/feed/`, "g"), `${basePath}/`)
    .replace(new RegExp(`${basePath}/xmlrpc\\.php(?:\\?rsd)?`, "g"), `${basePath}/`)
    .replace(new RegExp(`${basePath}/wp-comments-post\\.php`, "g"), `${basePath}/`)
    .replace(new RegExp(`${basePath}/category/uncategorized/`, "g"), `${basePath}/`)
    .replace(new RegExp(`${basePath}/author/mttacias/`, "g"), `${basePath}/`);

  return output;
}

async function copyTree(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (entry.name === "README.md") continue;

    const sourcePath = join(from, entry.name);
    const targetPath = join(to, entry.name);
    if (entry.isDirectory()) {
      await copyTree(sourcePath, targetPath);
    } else {
      await mkdir(dirname(targetPath), { recursive: true });
      await copyFile(sourcePath, targetPath);
    }
  }
}

for (const target of generatedTargets) {
  await rm(join(root, target), { recursive: true, force: true });
}

await copyTree(source, root);
await writeFile(join(root, ".nojekyll"), "", "utf8");

for (const file of walk(root)) {
  if (toRelativeFromRoot(file).startsWith("site/")) continue;
  if (toRelativeFromRoot(file).startsWith(".git/")) continue;
  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  if (statSync(file).size > 2_000_000) continue;

  const before = await readFile(file, "utf8");
  const after = prefixRootRelativeUrls(before);
  if (after !== before) await writeFile(file, after, "utf8");
}

console.log(`Prepared GitHub Pages output at repo root with base path ${basePath}`);
