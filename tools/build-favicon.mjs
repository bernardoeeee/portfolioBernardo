// Rasterises assets/favicon.svg's geometry to the PNG sizes Safari and iOS still
// require. No dependencies: supersampled software rasteriser + a minimal PNG writer.
//   node tools/build-favicon.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

const VOID = [6, 12, 24];
const PLATE = [11, 21, 40];
const ACCENT = [78, 168, 222];
const FLARE = [127, 196, 240];
const STAR = [242, 247, 255];

// design space is the SVG's 32x32 viewBox
const TRAVERSE = [[6.5, 13.5], [12.5, 24], [21.5, 21.5], [23.5, 9]];
const FAINT = [[21.5, 21.5, 1.35], [6.5, 13.5, 1.55], [12.5, 24, 1.7]];
const BRIGHT = [23.5, 9];

const mix = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

function sdRoundBox(px, py, half, r) {
  const qx = Math.abs(px - half) - half + r;
  const qy = Math.abs(py - half) - half + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function segDist(px, py, [ax, ay], [bx, by]) {
  const vx = bx - ax, vy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)));
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
}

// samples the artwork at one point in 32-unit design space -> [r,g,b,a]
function sample(x, y, radius) {
  if (sdRoundBox(x, y, 16, radius) > 0) return [0, 0, 0, 0];

  let c = mix(PLATE, VOID, (x + y) / 64);
  const over = (col, a) => {
    if (a <= 0) return;
    c = [c[0] + (col[0] - c[0]) * a, c[1] + (col[1] - c[1]) * a, c[2] + (col[2] - c[2]) * a];
  };

  // halo
  const dh = Math.hypot(x - BRIGHT[0], y - BRIGHT[1]) / 6.4;
  if (dh < 1) over(dh < 0.55 ? FLARE : ACCENT, (1 - dh) * (1 - dh) * 0.62);

  // traverse
  for (let i = 0; i < TRAVERSE.length - 1; i++) {
    if (segDist(x, y, TRAVERSE[i], TRAVERSE[i + 1]) <= 0.8) over(ACCENT, 0.9);
  }

  for (const [cx, cy, r] of FAINT) {
    if (Math.hypot(x - cx, y - cy) <= r) over(STAR, 1);
  }

  // diffraction spikes, fading from the core
  const dx = Math.abs(x - BRIGHT[0]), dy = Math.abs(y - BRIGHT[1]);
  if (dy <= 0.42 && dx <= 5.8) over(STAR, 0.85 * (1 - dx / 5.8));
  if (dx <= 0.42 && dy <= 5.8) over(STAR, 0.85 * (1 - dy / 5.8));

  if (Math.hypot(dx, dy) <= 2.55) over(STAR, 1);

  return [c[0], c[1], c[2], 255];
}

function render(size, radiusUnits) {
  const SS = 8;
  const buf = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = ((px + (sx + 0.5) / SS) / size) * 32;
          const y = ((py + (sy + 0.5) / SS) / size) * 32;
          const s = sample(x, y, radiusUnits);
          const sa = s[3] / 255;
          r += s[0] * sa; g += s[1] * sa; b += s[2] * sa; a += sa;
        }
      }
      const n = SS * SS;
      const i = (py * size + px) * 4;
      buf[i] = Math.round(a ? r / a : 0);
      buf[i + 1] = Math.round(a ? g / a : 0);
      buf[i + 2] = Math.round(a ? b / a : 0);
      buf[i + 3] = Math.round((a / n) * 255);
    }
  }
  return buf;
}

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return (buf) => {
    let c = -1;
    for (const byte of buf) c = t[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(body));
  return Buffer.concat([len, body, crc]);
}

function png(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// iOS applies its own corner mask, so the touch icon renders square.
for (const [name, size, radius] of [
  ["favicon-32.png", 32, 7],
  ["favicon-180.png", 180, 0],
]) {
  const file = join(OUT, name);
  writeFileSync(file, png(size, render(size, radius)));
  console.log("wrote", file);
}
