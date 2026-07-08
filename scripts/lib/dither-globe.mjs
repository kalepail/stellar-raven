/**
 * Shared dither-globe renderer — ONE sphere identity, recoloured per surface.
 *
 * A frozen frame of the landing hero's WebGL2 shader (src/site.ts): the Paper
 * `sphere` Lambert term + a 4x4 Bayer ordered dither, baked to a 2-colour RGB
 * buffer. Every baked-globe consumer shares this math so the playground, the
 * OAuth consent screen, and the OG/social image all show the SAME globe, each
 * passing only its own FRONT (lit) / BACK (field) colour:
 *   - playground  → dark green, a touch below the page field (recessed backdrop)
 *   - consent     → light olive, lifted above the field (inviting glow)
 *   - OG          → hot orange on deep green (mirrors the landing hero)
 *
 * Deterministic — no RNG, no time source. Callers regenerate, never hand-edit
 * the emitted modules.
 *
 * No deps beyond Node zlib (self-contained PNG encoder); no browser, no
 * ImageMagick for the globe itself.
 */
import { deflateSync } from "node:zlib";

// 4x4 Bayer ordered-dither threshold matrix (identical to the shader's bayer[16]).
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const norm = (v) => {
  const L = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / L, v[1] / L, v[2] / L];
};

/**
 * Render the sphere to an RGB8 Buffer (cols*rows*3).
 *   front / back : [r,g,b] in 0..1 — lit colour / unlit field colour.
 *   scale/offX/offY : frame the sphere in uv space (mirror GL_TUNE). One output
 *     pixel == one shader "cell"; geometry depends only on cols/rows + these.
 *   time : frozen light phase (2.5 faces the light at the viewer → a solid
 *     near-hemisphere at bottom-left dithering out through the terminator).
 *   bias : threshold nudge so the lit core stays fully solid.
 */
export function renderGlobeRgb({
  cols,
  rows,
  front,
  back,
  scale = 1.72,
  offX = -0.36,
  offY = -0.46,
  time = 2.5,
  bias = 0.0008
}) {
  const t = 0.5 * time;
  const lp = norm([Math.cos(1.5 * t), 0.8, Math.sin(1.25 * t)]);
  const m = Math.min(cols, rows);
  const B = front.map((c) => Math.round(c * 255));
  const G = back.map((c) => Math.round(c * 255));

  const rgb = Buffer.alloc(cols * rows * 3);
  for (let r = 0; r < rows; r++) {
    // PNG rows run top->bottom; gl_FragCoord.y runs bottom->top. Flip so the
    // globe (anchored bottom-left in shader space) lands bottom-left in the PNG.
    const cy = rows - 1 - r;
    for (let cx = 0; cx < cols; cx++) {
      const ux = ((cx + 0.5) - 0.5 * cols) / m / scale - offX;
      const uy = ((cy + 0.5) - 0.5 * rows) / m / scale - offY;
      const sx = ux * 2;
      const sy = uy * 2;
      const d = 1 - (sx * sx + sy * sy);
      const pz = Math.sqrt(Math.max(0, d));
      const lambert = lp[0] * sx + lp[1] * sy + lp[2] * pz;
      const shape = Math.max(0, lambert) * (d >= 0 ? 1 : 0);
      const thr = BAYER[(cy & 3) * 4 + (cx & 3)] / 16;
      const on = shape - bias >= thr ? 1 : 0;
      const col = on ? B : G;
      const o = (r * cols + cx) * 3;
      rgb[o] = col[0];
      rgb[o + 1] = col[1];
      rgb[o + 2] = col[2];
    }
  }
  return rgb;
}

/** Render straight to a PNG Buffer. */
export function renderGlobePng(opts) {
  return encodePng(opts.cols, opts.rows, renderGlobeRgb(opts));
}

/** Render to a base64 PNG string (for baking into a TS module / data: URL). */
export function renderGlobeBase64(opts) {
  return renderGlobePng(opts).toString("base64");
}

// --- minimal PNG encoder (truecolour RGB8, no deps) ---------------------------
export function encodePng(width, height, data) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour RGB
  // ihdr[10..12] = compression/filter/interlace = 0
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    data.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0, 0);
  return Buffer.concat([len, body, crc]);
}

let CRC_TABLE;
function crc32(buf) {
  if (!CRC_TABLE) {
    CRC_TABLE = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      CRC_TABLE[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ 0xffffffff;
}
