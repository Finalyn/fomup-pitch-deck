// Builds a fully static copy of the deck for GitHub Pages.
//
// The Lovable vite config always produces an SSR build, so there is no static
// preset to lean on. Instead we build with the node preset, boot the built
// server once, capture the rendered HTML and drop it next to the client assets.
import { spawn } from "node:child_process";
import { request } from "node:http";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const base = process.env.DECK_BASE ?? "/fomup-pitch-deck/";
const port = process.env.PAGES_PORT ?? "4190";
const outDir = "dist-pages";

const get = (url) =>
  new Promise((resolve, reject) => {
    const req = request(url, { method: "GET" }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject);
    req.end();
  });

const run = (command, args, env) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: { ...process.env, ...env },
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)),
    );
  });

console.log(`\nBuilding with base ${base}\n`);
await run("npm", ["run", "build"], { DECK_BASE: base, NITRO_PRESET: "node" });

const server = spawn("node", [".output/server/index.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "inherit",
  shell: false,
});

try {
  let html = "";
  let lastError = null;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await delay(500);
    try {
      const response = await get(`http://127.0.0.1:${port}${base}`);
      if (response.status !== 200) continue;
      html = response.body;
      if (html.includes("deck-slide")) break;
    } catch (error) {
      lastError = error;
      // server not up yet, retry
    }
  }
  if (!html) throw new Error(`could not capture the rendered page: ${lastError ?? "no response"}`);

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await cp(".output/public", outDir, { recursive: true });
  await writeFile(`${outDir}/index.html`, html);
  // GitHub Pages serves 404.html for unknown paths; sending the deck keeps
  // deep links working instead of showing the default error page.
  await writeFile(`${outDir}/404.html`, html);
  await writeFile(`${outDir}/.nojekyll`, "");

  const size = (await readFile(`${outDir}/index.html`)).length;
  console.log(`\nStatic deck written to ${outDir} (index.html ${size} bytes)\n`);
} finally {
  server.kill();
}
