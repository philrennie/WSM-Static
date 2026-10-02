// One-off: copy the images from the old WordPress site into src/images.
// Run from your own machine: npm run fetch-images
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const BASE = "https://www.whatsuziemade.co.uk/wp-content/uploads/";
const FILES = [
  "2026/10/WSM_Logo.jpeg", "2026/10/Banner.png", "2026/10/LetsBeFriendsSelfie.jpg",
  "2026/10/StatementArt_Icon.jpg", "2026/10/Ceramics_Icon.jpg", "2026/10/Plushie_Icon.jpg",
  "2026/10/MysteryScoop_Icon.jpg", "2026/10/Prints_Icon.jpg",
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => `2026/10/NewIn_${n}.jpg`),
  "2025/05/wsm01-scaled-1.png", "2025/05/wsm02-scaled-1.png", "2025/05/wsm03-scaled-1.png", "2025/05/wsm04-scaled-1.png",
];

const outDir = path.resolve("src/images");
await mkdir(outDir, { recursive: true });

for (const f of FILES) {
  const dest = path.join(outDir, path.basename(f));
  try { await access(dest); console.log("skip (exists)", path.basename(f)); continue; } catch {}
  const res = await fetch(BASE + f);
  if (!res.ok) { console.error("FAILED", res.status, f); continue; }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log("saved", path.basename(f));
}
