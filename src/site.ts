/**
 * Public presentation surface for stellar-raven-codemode.
 *
 * Two server-rendered pages, one visual system:
 *   - landingPage()  → GET /            (public marketing page)
 *   - consentPage()  → GET /authorize   (OAuth consent, rendered by workos.ts)
 *
 * Design — "dithered signal": a dark-green field (#151f14) with a single hot
 * orange (#ff5500), a Bayer-dithered orange globe rising out of the bottom-left
 * corner (a faithful port of Paper's Dithering `sphere` shader, hand-written in
 * inline WebGL2 so the page stays self-contained). The globe carries the retro /
 * digital signal; the type is the IBM Plex superfamily — Plex Serif (display),
 * Plex Sans (body), Plex Mono (utility), one shared skeleton — set on the right
 * so the copy never fights the animation. The product is one MCP endpoint with
 * two tools: `search` discovers across the Stellar catalog, `execute` runs
 * model-written JS in a no-network sandbox, so the CTA is per-client install.
 *
 * Fully self-contained + CSP-safe: fonts are embedded base64 (font-src data:),
 * the raven marks are inline SVG data URIs (img-src data:), all motion is the
 * one WebGL canvas. The landing page allows inline script (the shader + tab/copy
 * helpers); the consent page stays script-free and hardened.
 */
import {
  PLEX_SERIF_600_WOFF2,
  PLEX_SERIF_700_WOFF2,
  PLEX_SANS_400_WOFF2,
  PLEX_SANS_600_WOFF2,
  PLEX_MONO_400_WOFF2,
  PLEX_MONO_500_WOFF2
} from "./fonts";

const MCP_ENDPOINT = "https://raven.stellar.buzz/mcp";
const HOST = "raven.stellar.buzz";
const OG_IMAGE = "https://raven.stellar.buzz/og.png";

// Orange raven/star mark — reads as both a bird in flight and a four-point
// stellar spark. Inline SVG data URI (favicon) + raw path (in-page marks).
const RAVEN_PATH =
  "M2 14C8 13 10 9 12 4C14 9 16 13 22 14C16 14 13 16 12 20C11 16 8 14 2 14Z";
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='" +
  RAVEN_PATH +
  "' fill='%23ff5500'/%3E%3C/svg%3E";

function ravenSvg(cls: string): string {
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${RAVEN_PATH}"/></svg>`;
}

// ---------------------------------------------------------------------------
// Design system
// ---------------------------------------------------------------------------

function face(family: string, weight: number, b64: string): string {
  return (
    `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;` +
    `src:url(data:font/woff2;base64,${b64}) format('woff2')}`
  );
}

const FONT_FACE =
  face("IBM Plex Serif", 600, PLEX_SERIF_600_WOFF2) +
  face("IBM Plex Serif", 700, PLEX_SERIF_700_WOFF2) +
  face("IBM Plex Sans", 400, PLEX_SANS_400_WOFF2) +
  face("IBM Plex Sans", 600, PLEX_SANS_600_WOFF2) +
  face("IBM Plex Mono", 400, PLEX_MONO_400_WOFF2) +
  face("IBM Plex Mono", 500, PLEX_MONO_500_WOFF2);

const TOKENS = `:root{
  --bg:#0e150d; --green:#151f14; --green-2:#182617;
  --orange:#ff5500; --orange-2:#ff7a33; --orange-soft:rgba(255,85,0,.13);
  --fog:#eef0e2; --dim:#9aa890; --ash:#71806a;
  --line:rgba(238,240,226,.12); --line-2:rgba(238,240,226,.22);
  --display:'IBM Plex Serif',Georgia,'Times New Roman',serif;
  --sans:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --maxw:1200px;
}`;

const BASE = `
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--fog);font-family:var(--sans);
  font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  min-height:100vh;overflow-x:hidden}
a{color:inherit;text-decoration:none}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 32px;position:relative;z-index:2}
::selection{background:var(--orange);color:#180a00}

/* the live dither globe — fixed full-bleed canvas + a green fallback under it */
.stage{position:fixed;inset:0;z-index:0;background:var(--green)}
#gl{position:absolute;inset:0;width:100%;height:100%;display:block}
body.no-gl #gl{display:none}
body.no-gl .stage{background:
  radial-gradient(60% 60% at 12% 108%,rgba(255,85,0,.5),rgba(255,85,0,.06) 45%,transparent 66%),var(--green)}
/* legibility scrim: darken the RIGHT column where the copy lives; let the globe
   breathe on the lower-left */
.scrim{position:fixed;inset:0;z-index:1;pointer-events:none;
  background:
    radial-gradient(74% 66% at 84% 44%,rgba(14,21,13,.92),rgba(14,21,13,.55) 44%,transparent 72%),
    linear-gradient(180deg,rgba(14,21,13,.6),transparent 20%),
    radial-gradient(120% 90% at 100% 0%,rgba(255,85,0,.05),transparent 55%)}

.eyebrow{display:inline-flex;align-items:center;gap:12px;font-family:var(--mono);font-size:12px;
  font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--dim)}
.eyebrow .live{display:inline-flex;align-items:center;gap:7px;color:var(--orange)}
.eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--orange);
  box-shadow:0 0 0 0 rgba(255,85,0,.7);animation:pulse 2.4s ease-out infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(255,85,0,.55)}70%{box-shadow:0 0 0 10px rgba(255,85,0,0)}100%{box-shadow:0 0 0 0 rgba(255,85,0,0)}}

/* ---- top bar: just the logo, prominent ---- */
.top{position:relative;z-index:5}
.top-in{display:flex;align-items:center;height:92px}
.brand{display:flex;align-items:center;gap:14px}
.brand .rv{width:34px;height:34px;fill:var(--orange);flex:none;filter:drop-shadow(0 0 16px rgba(255,85,0,.55))}
.brand .wm{display:flex;flex-direction:column;line-height:1}
.brand .wm b{font-family:var(--display);font-weight:600;font-size:25px;letter-spacing:-.015em;color:var(--fog)}
.brand .wm i{font-family:var(--mono);font-style:normal;font-size:11px;font-weight:500;letter-spacing:.24em;
  text-transform:uppercase;color:var(--dim);margin-top:5px}

/* ---- buttons ---- */
.btn{display:inline-flex;align-items:center;gap:9px;font-family:var(--sans);font-weight:600;
  font-size:15px;padding:13px 20px;border-radius:12px;border:1px solid transparent;cursor:pointer;
  line-height:1;white-space:nowrap;transition:transform .15s ease,box-shadow .2s,background .2s,color .2s,border-color .2s}
.btn:active{transform:translateY(1px)}
.btn-primary{background:var(--orange);color:#180a00;box-shadow:0 12px 36px -12px rgba(255,85,0,.8)}
.btn-primary:hover{background:var(--orange-2);box-shadow:0 16px 44px -12px rgba(255,85,0,.95);transform:translateY(-2px)}
.btn-ghost{background:transparent;color:var(--dim);border-color:var(--line-2);font-family:var(--mono);
  font-weight:500;font-size:11px;letter-spacing:.02em;padding:8px 13px;border-radius:9px}
.btn-ghost:hover{border-color:var(--orange);color:var(--fog)}
.btn:focus-visible,a:focus-visible,button:focus-visible{outline:2px solid var(--orange);outline-offset:3px}

/* ---- hero: copy in a right-aligned column, clear of the globe ---- */
.hero{position:relative;min-height:calc(100vh - 92px);display:flex;flex-direction:column;
  justify-content:center;padding:32px 0 60px}
.hero-in{max-width:600px;margin-left:auto}
h1.title{font-family:var(--display);font-weight:700;margin:22px 0 0;line-height:.98;
  font-size:clamp(52px,8vw,104px);letter-spacing:-.025em;color:var(--fog)}
h1.title .r{color:var(--orange);text-shadow:0 0 40px rgba(255,85,0,.35)}
.lede{font-size:clamp(16px,1.7vw,19px);color:var(--fog);opacity:.94;max-width:46ch;margin:24px 0 0;line-height:1.6}
.lede b{font-weight:600}
.lede code{font-family:var(--mono);font-size:.85em;font-weight:500;color:var(--orange);background:var(--orange-soft);
  border:1px solid rgba(255,85,0,.24);padding:1px 6px;border-radius:6px;white-space:nowrap}

/* ---- connect panel (the CTA) ---- */
.connect{margin-top:34px;border:1px solid var(--line-2);border-radius:16px;overflow:hidden;
  background:linear-gradient(180deg,rgba(24,38,23,.74),rgba(14,21,13,.7));
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:0 30px 70px -34px rgba(0,0,0,.75),inset 0 1px 0 rgba(238,240,226,.05)}
.connect-head{display:flex;align-items:center;gap:11px;padding:16px 18px;border-bottom:1px solid var(--line)}
.connect-head .h{font-family:var(--sans);font-weight:600;font-size:14px;color:var(--fog)}
.connect-head .end{margin-left:auto;font-family:var(--mono);font-size:12px;color:var(--dim);
  display:flex;align-items:center;gap:8px}
.connect-head .end .rv{width:15px;height:15px;fill:var(--orange)}
.connect-head .end b{color:var(--orange);font-weight:500}
/* client tabs: cut from the terminal's own material and joined to it (active tab
   shares the term fill, drops its bottom border, and overlaps the term's top edge
   by 1px so there's no seam). Strip is inset past the term's rounded corner. */
.tabs{display:flex;gap:3px;overflow-x:auto;padding:14px 12px 0 24px;scrollbar-width:none;position:relative;z-index:1}
.tabs::-webkit-scrollbar{display:none}
.tab{font-family:var(--mono);font-size:12px;font-weight:500;padding:8px 15px 11px;border:1px solid transparent;
  border-bottom:0;border-radius:10px 10px 0 0;color:var(--dim);cursor:pointer;white-space:nowrap;
  background:transparent;position:relative;transition:color .15s,background .15s,border-color .15s}
.tab:hover{color:var(--fog);background:rgba(238,240,226,.045)}
.tab.active{color:var(--orange);background:rgba(6,10,6,.82);border-color:var(--line);margin-bottom:-1px;z-index:3}
.term{position:relative;margin:0 12px 12px;border:1px solid var(--line);border-radius:12px;background:rgba(6,10,6,.82);overflow:hidden}
.term-bar{display:flex;align-items:center;gap:7px;padding:11px 14px;border-bottom:1px solid var(--line)}
.tl{width:10px;height:10px;border-radius:50%}.tl.r{background:#ff5f57}.tl.y{background:#febc2e}.tl.g{background:#28c840}
.term-name{margin-left:8px;font-family:var(--mono);font-size:11.5px;color:var(--ash)}
.term-copy{margin-left:auto}
.panel{display:none}.panel.active{display:block}
pre.code{margin:0;padding:16px 18px;font-family:var(--mono);font-size:12.5px;line-height:1.72;
  color:#d3dac8;white-space:pre;overflow-x:auto}
pre.code .c{color:var(--ash);font-style:italic}
pre.code .p{color:var(--fog)}
pre.code .s{color:var(--orange-2)}
pre.code .k{color:#93d6a6}
.connect-foot{padding:2px 18px 16px;font-family:var(--sans);font-size:13px;color:var(--dim)}
.connect-foot b{color:var(--fog);font-weight:600}
.copied{color:var(--orange)!important;border-color:var(--orange)!important}

/* ---- footer ---- */
footer{position:relative;z-index:2;border-top:1px solid var(--line);margin-top:20px;
  background:linear-gradient(0deg,rgba(14,21,13,.96),rgba(14,21,13,.66))}
.foot{display:flex;flex-wrap:wrap;gap:14px 26px;align-items:center;justify-content:space-between;padding:24px 0 32px}
.foot .l{font-family:var(--mono);font-size:12px;color:var(--ash);text-shadow:0 1px 3px rgba(14,21,13,.9)}
.foot .l b{color:var(--dim);font-weight:400}
.foot-links{display:flex;gap:24px}
.foot-links a{font-family:var(--mono);font-size:12px;color:var(--dim);text-shadow:0 1px 3px rgba(14,21,13,.9)}
.foot-links a:hover{color:var(--orange)}

@media (max-width:820px){
  .wrap{padding:0 22px}
  .top-in{height:74px}
  .brand .rv{width:28px;height:28px}
  .brand .wm b{font-size:21px}
  .hero{min-height:auto;padding:18px 0 40px}
  .hero-in{max-width:100%;margin-left:0}
  h1.title{font-size:clamp(44px,13vw,68px)}
  .scrim{background:
    linear-gradient(180deg,var(--bg) 4%,rgba(14,21,13,.9) 40%,rgba(14,21,13,.6) 58%,rgba(14,21,13,.3) 76%,rgba(14,21,13,.55))}
  .connect-head .end{display:none}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

// ---------------------------------------------------------------------------
// WebGL2 dither-sphere shader — hand-written port of Paper's `sphere` +
// 4x4 Bayer ordered dithering. Two colors only (back = green, front = orange),
// a rotating light, pixelated to `PXSIZE` cells.
// ---------------------------------------------------------------------------

const VERT = `#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_scale;
uniform vec2 u_offset;
uniform float u_px;
uniform vec3 u_back;
uniform vec3 u_front;
out vec4 o;
const float bayer[16] = float[16](
  0.0, 8.0, 2.0, 10.0,
  12.0, 4.0, 14.0, 6.0,
  3.0, 11.0, 1.0, 9.0,
  15.0, 7.0, 13.0, 5.0);
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 cell = floor(fc / u_px);
  vec2 px = (cell + 0.5) * u_px;
  float m = min(u_res.x, u_res.y);
  vec2 uv = (px - 0.5 * u_res) / m;
  uv /= u_scale;
  uv -= u_offset;
  vec2 sUV = uv * 2.0;
  float d = 1.0 - dot(sUV, sUV);
  vec3 pos = vec3(sUV, sqrt(max(0.0, d)));
  float t = 0.5 * u_time;
  vec3 lp = normalize(vec3(cos(1.5 * t), 0.8, sin(1.25 * t)));
  float shape = max(0.0, dot(lp, pos)) * step(0.0, d);
  int bx = int(mod(cell.x, 4.0));
  int by = int(mod(cell.y, 4.0));
  float thr = bayer[by * 4 + bx] / 16.0;
  float on = step(thr, shape - 0.0008);
  vec3 col = mix(u_back, u_front, on);
  o = vec4(col, 1.0);
}`;

// Tuning knobs for the globe (bottom-left, large). Kept together to nudge.
const GL_TUNE = {
  speed: 0.56,
  scale: 1.72,
  offX: -0.36,
  offY: -0.46,
  px: 3.0
};

const SCRIPT = `
(function(){
  var cv = document.getElementById('gl');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl = cv && cv.getContext ? cv.getContext('webgl2', {antialias:false, alpha:false, powerPreference:'low-power'}) : null;
  if(!gl){ document.body.classList.add('no-gl'); }
  else {
    var VS = ${JSON.stringify(VERT)};
    var FS = ${JSON.stringify(FRAG)};
    var speed = ${GL_TUNE.speed}, scale = ${GL_TUNE.scale}, offX = ${GL_TUNE.offX}, offY = ${GL_TUNE.offY}, PX = ${GL_TUNE.px};
    function mk(t, s){ var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
    var prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){ document.body.classList.add('no-gl'); }
    else {
      gl.useProgram(prog);
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
      var la = gl.getAttribLocation(prog, 'a');
      gl.enableVertexAttribArray(la);
      gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
      var uRes = gl.getUniformLocation(prog, 'u_res');
      var uTime = gl.getUniformLocation(prog, 'u_time');
      var uScale = gl.getUniformLocation(prog, 'u_scale');
      var uOff = gl.getUniformLocation(prog, 'u_offset');
      var uPx = gl.getUniformLocation(prog, 'u_px');
      gl.uniform3f(gl.getUniformLocation(prog, 'u_back'), 0.082, 0.122, 0.078);
      gl.uniform3f(gl.getUniformLocation(prog, 'u_front'), 1.0, 0.333, 0.0);
      gl.uniform1f(uScale, scale);
      gl.uniform2f(uOff, offX, offY);
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      function resize(){
        var w = cv.clientWidth, h = cv.clientHeight;
        cv.width = Math.max(1, Math.round(w * dpr));
        cv.height = Math.max(1, Math.round(h * dpr));
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform2f(uRes, cv.width, cv.height);
        gl.uniform1f(uPx, PX * dpr);
      }
      window.addEventListener('resize', resize);
      resize();
      var start = null;
      function frame(now){
        if(start === null) start = now;
        gl.uniform1f(uTime, (now - start) / 1000 * speed);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if(!reduce) requestAnimationFrame(frame);
      }
      if(reduce){ gl.uniform1f(uTime, 5.2); gl.drawArrays(gl.TRIANGLES, 0, 3); }
      else requestAnimationFrame(frame);
    }
  }
  // ---- tabs + copy ----
  function activate(tab){
    var name = tab.getAttribute('data-tab');
    var tabs = document.querySelectorAll('.tab');
    for(var i=0;i<tabs.length;i++) tabs[i].classList.remove('active');
    tab.classList.add('active');
    var panels = document.querySelectorAll('.panel');
    for(var j=0;j<panels.length;j++) panels[j].classList.toggle('active', panels[j].getAttribute('data-panel') === name);
  }
  function flash(btn){
    var orig = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', orig);
    btn.textContent = 'Copied';
    btn.classList.add('copied');
    setTimeout(function(){ btn.textContent = orig; btn.classList.remove('copied'); }, 1400);
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest ? e.target.closest('[data-tab]') : null;
    if(t){ activate(t); return; }
    var c = e.target.closest ? e.target.closest('[data-copy]') : null;
    if(c){
      var el = document.querySelector(c.getAttribute('data-copy'));
      if(el && navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(el.innerText).then(function(){ flash(c); }, function(){});
      }
      return;
    }
  });
})();
`;

// ---------------------------------------------------------------------------
// Page shells
// ---------------------------------------------------------------------------

function head(title: string, description: string, css: string, headExtra: string = ""): string {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}"/>
<meta name="theme-color" content="#0e150d"/>
<meta name="color-scheme" content="dark"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${escapeHtml(title)}"/>
<meta property="og:description" content="${escapeHtml(description)}"/>
<meta property="og:image" content="${OG_IMAGE}"/>
<meta property="og:url" content="https://${HOST}/"/>
<meta property="og:site_name" content="Stellar Raven"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escapeHtml(title)}"/>
<meta name="twitter:description" content="${escapeHtml(description)}"/>
<meta name="twitter:image" content="${OG_IMAGE}"/>
<link rel="icon" href="${FAVICON}"/>
<link rel="apple-touch-icon" href="${FAVICON}"/>
<link rel="canonical" href="https://${HOST}/"/>
<style>${FONT_FACE}${TOKENS}${css}</style>${headExtra}
</head><body>`;
}

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------

const CLIENTS: Array<{ id: string; name: string; term: string; code: string }> = [
  {
    id: "cc",
    name: "Claude Code",
    term: "terminal",
    code:
      `<span class="c"># add the remote server over HTTP, then authorize</span>\n` +
      `<span class="p">claude</span> mcp add --transport http <span class="s">stellar-raven</span> <span class="p">\\</span>\n` +
      `  <span class="s">"${MCP_ENDPOINT}"</span>\n` +
      `<span class="c"># run /mcp -> Authenticate -> sign in in your browser</span>`
  },
  {
    id: "codex",
    name: "Codex",
    term: "terminal",
    code:
      `<span class="c"># add the streamable-HTTP server, then log in</span>\n` +
      `<span class="p">codex</span> mcp add <span class="s">stellar-raven</span> --url <span class="s">"${MCP_ENDPOINT}"</span>\n` +
      `<span class="p">codex</span> mcp login <span class="s">stellar-raven</span>  <span class="c"># opens your browser</span>`
  },
  {
    id: "cursor",
    name: "Cursor",
    term: "~/.cursor/mcp.json",
    code:
      `<span class="c">// ~/.cursor/mcp.json  (or .cursor/mcp.json per project)</span>\n` +
      `{\n` +
      `  <span class="k">"mcpServers"</span>: {\n` +
      `    <span class="k">"stellar-raven"</span>: { <span class="k">"url"</span>: <span class="s">"${MCP_ENDPOINT}"</span> }\n` +
      `  }\n` +
      `}\n` +
      `<span class="c">// Cursor runs the OAuth sign-in on first use</span>`
  },
  {
    id: "cd",
    name: "Claude Desktop",
    term: "Settings -> Connectors",
    code:
      `<span class="c"># Settings -> Connectors -> Add custom connector</span>\n` +
      `<span class="c"># paste the endpoint:</span>\n` +
      `<span class="s">${MCP_ENDPOINT}</span>\n` +
      `<span class="c"># approve the browser sign-in — that's it</span>`
  },
  {
    id: "vscode",
    name: "VS Code",
    term: "terminal",
    code:
      `<span class="c"># add via the CLI (or .vscode/mcp.json)</span>\n` +
      `<span class="p">code</span> --add-mcp <span class="s">'{"name":"stellar-raven","type":"http","url":"${MCP_ENDPOINT}"}'</span>`
  },
  {
    id: "other",
    name: "Other",
    term: "mcp.json",
    code:
      `<span class="c"># no native remote/OAuth support? bridge with mcp-remote</span>\n` +
      `{\n` +
      `  <span class="k">"mcpServers"</span>: {\n` +
      `    <span class="k">"stellar-raven"</span>: {\n` +
      `      <span class="k">"command"</span>: <span class="s">"npx"</span>,\n` +
      `      <span class="k">"args"</span>: [<span class="s">"mcp-remote"</span>, <span class="s">"${MCP_ENDPOINT}"</span>]\n` +
      `    }\n` +
      `  }\n` +
      `}`
  }
];

function tabButtons(): string {
  return CLIENTS.map(
    (c, i) => `<button class="tab${i === 0 ? " active" : ""}" data-tab="${c.id}">${escapeHtml(c.name)}</button>`
  ).join("");
}

function panels(): string {
  return CLIENTS.map((c, i) => {
    const codeId = `code-${c.id}`;
    return `<div class="panel${i === 0 ? " active" : ""}" data-panel="${c.id}">
  <div class="term">
    <div class="term-bar"><span class="tl r"></span><span class="tl y"></span><span class="tl g"></span>
      <span class="term-name">${escapeHtml(c.term)}</span>
      <button class="btn btn-ghost term-copy" data-copy="#${codeId}">Copy</button>
    </div>
    <pre class="code" id="${codeId}">${c.code}</pre>
  </div>
</div>`;
  }).join("");
}

function brand(): string {
  return `<a class="brand" href="/">${ravenSvg("rv")}<span class="wm"><b>Stellar Raven</b><i>codemode</i></span></a>`;
}

// JSON-LD structured data — landing page only (the consent page stays
// script-free). `<` / `>` / `&` are unicode-escaped so the serialized JSON can
// never break out of the <script> element.
const JSONLD =
  `<script type="application/ld+json">` +
  JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `https://${HOST}/#website`,
        url: `https://${HOST}/`,
        name: "Stellar Raven",
        description: "One MCP endpoint over the whole Stellar ecosystem, for AI agents."
      },
      {
        "@type": "SoftwareApplication",
        "@id": `https://${HOST}/#app`,
        name: "Stellar Raven",
        url: `https://${HOST}/`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any (remote MCP server)",
        description:
          "A remote MCP server for AI agents: search discovers across the Stellar ecosystem " +
          "(Lumenloop, Stellar Light/Scout, the docs, and a curated skills library) and execute " +
          "runs the code that composes it, sandboxed with no network.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@type": "Organization", name: "Stellar", url: "https://stellar.org" }
      }
    ]
  })
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026") +
  `</script>`;

export function landingPage(): string {
  return (
    head(
      "Stellar Raven — all of Stellar, one MCP endpoint for your agent",
      "Give your AI agent all of Stellar in one connection. search discovers across Lumenloop, Stellar Light/Scout, the docs, and a curated skills library; execute runs the code that composes them, sandboxed with no network. Point Claude, Cursor, Codex, or any MCP client at Raven — one OAuth sign-in, no keys.",
      BASE,
      JSONLD
    ) +
    `<div class="stage"><canvas id="gl"></canvas></div><div class="scrim"></div>` +
    `<header class="top"><div class="wrap top-in">${brand()}</div></header>` +
    `<main class="wrap"><section class="hero" id="connect"><div class="hero-in">
  <p class="eyebrow">Remote MCP server <span class="live"><span class="dot"></span>live</span></p>
  <h1 class="title">Stellar <span class="r">Raven</span></h1>
  <p class="lede"><b>One endpoint, two tools — all of Stellar.</b> <code>search</code> discovers across
    the whole ecosystem; <code>execute</code> runs the code that composes it. Point any MCP client at
    Raven — no keys, no glue.</p>

  <div class="connect">
    <div class="connect-head">
      <span class="h">Connect your agent</span>
      <span class="end">${ravenSvg("rv")}<b>${escapeHtml(HOST)}</b>/mcp</span>
    </div>
    <div class="tabs">${tabButtons()}</div>
    ${panels()}
    <div class="connect-foot">One browser <b>OAuth sign-in</b> on first connect — then your agent's code runs in a <b>no-network</b> sandbox.</div>
  </div>
</div></section></main>` +
    `<footer><div class="wrap foot">
  <div class="l">${escapeHtml(HOST)} <b>·</b> all of Stellar, one MCP endpoint</div>
  <div class="foot-links">
    <a href="https://github.com/kalepail/stellar-raven" target="_blank" rel="noopener">GitHub</a>
    <a href="https://stellar.org" target="_blank" rel="noopener">Stellar</a>
  </div>
</div></footer>` +
    `<script>${SCRIPT}</script></body></html>`
  );
}

// ---------------------------------------------------------------------------
// Consent page (OAuth /authorize) — same system, script-free + hardened.
// ---------------------------------------------------------------------------

const CONSENT_CSS = `
body{display:flex;flex-direction:column}
/* no WebGL here (script-free page) — a CSS dither-glow evokes the globe */
.stage{background:
  radial-gradient(52% 46% at 12% 106%,rgba(255,85,0,.5),rgba(255,85,0,.07) 46%,transparent 66%),
  var(--green)}
.stage::after{content:"";position:absolute;inset:0;opacity:.5;mix-blend-mode:screen;
  background-image:radial-gradient(rgba(255,85,0,.9) 1px,transparent 1.4px);
  background-size:4px 4px;
  -webkit-mask-image:radial-gradient(52% 46% at 12% 106%,#000,transparent 60%);
  mask-image:radial-gradient(52% 46% at 12% 106%,#000,transparent 60%)}
.scrim{background:
  linear-gradient(140deg,var(--bg) 6%,rgba(14,21,13,.8) 40%,rgba(14,21,13,.4) 66%,transparent 88%),
  linear-gradient(0deg,rgba(14,21,13,.6),transparent 40%)}
main.auth{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 22px 64px;
  position:relative;z-index:2}
.card{width:100%;max-width:460px;border:1px solid var(--line-2);border-radius:20px;
  background:linear-gradient(180deg,rgba(24,38,23,.84),rgba(14,21,13,.82));
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  box-shadow:0 40px 90px -38px rgba(0,0,0,.85),inset 0 1px 0 rgba(238,240,226,.05);overflow:hidden}
.card-top{padding:36px 34px 0;text-align:center}
.conn{display:flex;align-items:center;justify-content:center;margin:6px 0 24px}
.node{width:58px;height:58px;border-radius:16px;display:flex;align-items:center;justify-content:center;
  background:rgba(6,10,6,.7);border:1px solid var(--line-2)}
.node.raven .rv{width:30px;height:30px;fill:var(--orange);filter:drop-shadow(0 0 12px rgba(255,85,0,.7))}
.node.client{font-family:var(--display);font-weight:600;font-size:24px;color:var(--fog)}
.wire{position:relative;width:52px;height:2px;background:linear-gradient(90deg,var(--line-2),var(--orange))}
.wire::after{content:"";position:absolute;top:50%;left:50%;width:8px;height:8px;border-radius:50%;
  transform:translate(-50%,-50%);background:var(--orange);box-shadow:0 0 12px rgba(255,85,0,.8)}
.card h1{font-family:var(--display);font-weight:600;font-size:27px;line-height:1.15;letter-spacing:-.015em;
  margin:0;color:var(--fog)}
.card .sub{color:var(--dim);font-size:15px;margin:14px 0 0;line-height:1.55}
.card .sub b{color:var(--fog);font-weight:600}
.panel-h{font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:var(--dim);padding:28px 34px 4px}
.scopes{list-style:none;margin:0;padding:0 34px}
.scopes li{display:flex;gap:12px;align-items:flex-start;padding:13px 0;border-top:1px solid var(--line)}
.scopes li:first-child{border-top:0}
.tick{flex:none;margin-top:2px}
.scope-code{font-family:var(--mono);font-size:12px;color:var(--orange);background:var(--orange-soft);
  border:1px solid rgba(255,85,0,.24);padding:1px 7px;border-radius:6px}
.scope-desc{font-size:13.5px;color:var(--dim);margin-top:6px;line-height:1.5}
.act{padding:24px 34px 32px}
.act .btn-primary{width:100%;justify-content:center;padding:15px}
.note{display:flex;gap:9px;align-items:flex-start;font-size:12.5px;color:var(--dim);margin:16px 0 0;line-height:1.5}
.note svg{flex:none;margin-top:1px}
.auth-brand{display:flex;align-items:center;justify-content:center;gap:11px;padding:30px 0 4px;
  position:relative;z-index:2}
.auth-brand .rv{width:22px;height:22px;fill:var(--orange);filter:drop-shadow(0 0 12px rgba(255,85,0,.5))}
.auth-brand b{font-family:var(--display);font-weight:600;font-size:17px;color:var(--fog)}
.auth-brand i{font-family:var(--mono);font-style:normal;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ash)}
`;

const TICK =
  `<svg class="tick" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">` +
  `<path d="M13 4.5 6.5 11 3 7.5" fill="none" stroke="#ff5500" stroke-width="2" ` +
  `stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW =
  `<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">` +
  `<path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="#180a00" stroke-width="1.9" ` +
  `stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SHIELD =
  `<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">` +
  `<path d="M8 1.5 13 3.3v4.2c0 3-2.1 5.5-5 6.9-2.9-1.4-5-3.9-5-6.9V3.3L8 1.5Z" ` +
  `fill="none" stroke="#71806a" stroke-width="1.3" stroke-linejoin="round"/></svg>`;

const SCOPE_GLOSS: Record<string, string> = {
  mcp: "Run search and execute against the Stellar service catalog on your behalf."
};

/**
 * View-model rendering for the consent page. workos.ts passes the already-safe
 * display strings and wraps the result in a Response (cookies live there).
 */
export function consentPage(args: {
  clientName: string;
  scopes: string[];
  csrfToken: string;
  formAction: string;
}): string {
  const clientName = escapeHtml(args.clientName.trim() || "Unknown MCP client");
  const initial = escapeHtml((args.clientName.trim() || "?").charAt(0).toUpperCase());
  const scopes = args.scopes.length ? args.scopes : ["(no scopes requested)"];
  const scopeItems = scopes
    .map((s) => {
      const gloss = SCOPE_GLOSS[s];
      return (
        `<li>${TICK}<div><code class="scope-code">${escapeHtml(s)}</code>` +
        (gloss ? `<div class="scope-desc">${escapeHtml(gloss)}</div>` : ``) +
        `</div></li>`
      );
    })
    .join("");
  return (
    head("Authorize · Stellar Raven", "Authorize an MCP client to connect to Stellar Raven.", BASE + CONSENT_CSS) +
    `<div class="stage"></div><div class="scrim"></div>` +
    `<div class="auth-brand">${ravenSvg("rv")}<b>Stellar Raven</b><i>codemode</i></div>` +
    `<main class="auth"><div class="card">
  <div class="card-top">
    <div class="conn"><div class="node client">${initial}</div><div class="wire"></div>
      <div class="node raven">${ravenSvg("rv")}</div></div>
    <h1>${clientName} wants to connect</h1>
    <p class="sub">It will access <b>Stellar Raven</b> as you, once you sign in with WorkOS.</p>
  </div>
  <div class="panel-h">This connection grants</div>
  <ul class="scopes">${scopeItems}</ul>
  <div class="act">
    <form method="post" action="${escapeHtml(args.formAction)}">
      <input type="hidden" name="csrf_token" value="${escapeHtml(args.csrfToken)}"/>
      <button class="btn btn-primary" type="submit">Approve and continue ${ARROW}</button>
    </form>
    <p class="note">${SHIELD}<span>Only continue if you started this connection. Approving redirects
      you to WorkOS AuthKit to sign in — your password never reaches this server.</span></p>
  </div>
</div></main>` +
    `</body></html>`
  );
}

// ---------------------------------------------------------------------------
// Response headers — landing allows inline script (shader + tabs); consent is
// script-free. Both self-contained: font-src data:, img-src data:, no network.
// ---------------------------------------------------------------------------

export const LANDING_HEADERS: Record<string, string> = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=300",
  "content-security-policy":
    "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; " +
    "font-src data:; img-src data:; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

export const CONSENT_HEADERS: Record<string, string> = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "no-store",
  "content-security-policy":
    "default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:; " +
    "frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff"
};

// ---------------------------------------------------------------------------
// Crawler surfaces — robots.txt + sitemap.xml. Canonical host is HOST
// (raven.stellar.buzz); the OAuth/API paths are disallowed since they carry no
// indexable content. Wired to routes in auth/workos.ts.
// ---------------------------------------------------------------------------

export function robotsTxt(): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /authorize",
    "Disallow: /callback",
    "Disallow: /mcp",
    `Sitemap: https://${HOST}/sitemap.xml`,
    ""
  ].join("\n");
}

export function sitemapXml(): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url><loc>https://${HOST}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
    `</urlset>\n`
  );
}

export const ROBOTS_HEADERS: Record<string, string> = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "public, max-age=86400"
};

export const SITEMAP_HEADERS: Record<string, string> = {
  "content-type": "application/xml; charset=utf-8",
  "cache-control": "public, max-age=86400"
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
