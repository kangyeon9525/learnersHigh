import WebSocket from "ws";
import { randomUUID } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CHANNEL = process.argv[2] || "sanxzj25";
const OUT_DIR = join(ROOT, "design", "figma-import", "screens");

const FRAMES = [
  { id: "64:3", slug: "growth-garden-dashboard" },
  { id: "64:224", slug: "study-timer-focus-warning" },
  { id: "64:384", slug: "session-result-modal" },
  { id: "64:495", slug: "home-dashboard" },
  { id: "64:637", slug: "mypage-achievements" },
  { id: "64:856", slug: "daily-report" },
];

function connect() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket("ws://localhost:3055");
    ws.on("open", () => resolve(ws));
    ws.on("error", reject);
  });
}

function send(ws, payload, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const id = payload.id || randomUUID();
    const message = { ...payload, id };
    const timer = setTimeout(() => {
      ws.off("message", onMessage);
      reject(new Error(`Timeout: ${payload.message?.command ?? payload.type}`));
    }, timeoutMs);

    function onMessage(raw) {
      const data = JSON.parse(raw.toString());
      const inner = data.message ?? data;
      if (inner?.id === id) {
        clearTimeout(timer);
        ws.off("message", onMessage);
        if (inner.error) reject(new Error(inner.error));
        else resolve(inner.result ?? inner);
      }
    }

    ws.on("message", onMessage);
    ws.send(JSON.stringify(message));
  });
}

async function joinChannel(ws, channel) {
  const id = randomUUID();
  await send(ws, { id, type: "join", channel });
}

async function command(ws, channel, cmd, params = {}) {
  const id = randomUUID();
  return send(ws, {
    id,
    type: "message",
    channel,
    message: { id, command: cmd, params: { ...params, commandId: id } },
  });
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const ws = await connect();
  const manifest = [];

  try {
    await joinChannel(ws, CHANNEL);

    for (const frame of FRAMES) {
      console.log(`Exporting ${frame.slug} (${frame.id})...`);
      const exported = await command(ws, CHANNEL, "export_node_as_image", {
        nodeId: frame.id,
        format: "PNG",
        scale: 2,
      });

      const fileName = `${frame.slug}.png`;
      const filePath = join(OUT_DIR, fileName);
      writeFileSync(filePath, Buffer.from(exported.imageData, "base64"));
      manifest.push({ ...frame, file: `screens/${fileName}`, width: 1280, height: 1024 });
      console.log(`  -> ${filePath}`);
    }

    writeFileSync(join(ROOT, "design", "figma-import", "screens-manifest.json"), JSON.stringify(manifest, null, 2));
  } finally {
    ws.close();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
