/**
 * /demo playground page — server-rendered, same visual system as site.ts
 * (dark-green field, hot orange, IBM Plex superfamily, terminal chrome).
 *
 * Two states, one shell:
 *   - demoPage({ authenticated: false }) → locked: honest explainer, sign-in
 *     button (/demo/login), and a static example trace rendered from
 *     hard-coded sample data using the SAME card markup the live client
 *     builds, so the locked page previews exactly what a session looks like.
 *   - demoPage({ authenticated: true })  → chat UI: message list, composer,
 *     and the trace renderer driven by one inline vanilla script that POSTs
 *     /demo/chat and parses the DemoFrame SSE stream (src/demo/frames.ts).
 *
 * Trace honesty rules (design Decision 1 + review): tool cards render the
 * envelope as returned — error.kind is only ever "error" or "soft-empty" —
 * and a tool-start whose tool-result never arrives before done/error is
 * marked STALLED, never silently dropped.
 *
 * Expand/collapse is native <details>/<summary> in both states, so the locked
 * page needs zero JavaScript and the live client gets toggling for free.
 */
import { BASE, FAVICON, FONT_FACE, TOKENS, ravenSvg } from "../site.ts";

// ---------------------------------------------------------------------------
// Page CSS — on top of the shared FONT_FACE/TOKENS/BASE design system.
// ---------------------------------------------------------------------------

const DEMO_CSS = `
body{display:flex;flex-direction:column}
/* script-budget goes to the chat client — the backdrop is the consent page's
   CSS dither-glow, not the WebGL globe */
.stage{background:
  radial-gradient(52% 46% at 10% 108%,rgba(255,85,0,.4),rgba(255,85,0,.06) 46%,transparent 66%),
  var(--green)}
.stage::after{content:"";position:absolute;inset:0;opacity:.45;mix-blend-mode:screen;
  background-image:radial-gradient(rgba(255,85,0,.9) 1px,transparent 1.4px);
  background-size:4px 4px;
  -webkit-mask-image:radial-gradient(52% 46% at 10% 108%,#000,transparent 60%);
  mask-image:radial-gradient(52% 46% at 10% 108%,#000,transparent 60%)}
.scrim{background:
  linear-gradient(180deg,rgba(14,21,13,.85) 0%,rgba(14,21,13,.62) 34%,rgba(14,21,13,.38) 66%,rgba(14,21,13,.66) 100%)}

.pwrap{width:100%;max-width:880px;margin:0 auto;padding:0 22px;position:relative;z-index:2}
main.play{flex:1;display:flex;flex-direction:column;padding-bottom:34px}
.top-in .end{margin-left:auto}

/* honest-context line under the header */
.fineprint{font-family:var(--mono);font-size:11.5px;color:var(--ash);line-height:1.65;
  border-left:2px solid rgba(255,85,0,.35);padding-left:12px;margin:6px 0 18px}
.fineprint b{color:var(--dim);font-weight:500}
.fineprint code{color:var(--orange);font-size:.95em}

/* ---- transcript ---- */
#log{flex:1}
.msg{max-width:76%;padding:12px 16px;margin:14px 0;border-radius:14px;font-size:14.5px;
  line-height:1.62;white-space:pre-wrap;overflow-wrap:anywhere}
.msg.user{margin-left:auto;color:var(--fog);background:var(--orange-soft);
  border:1px solid rgba(255,85,0,.32);border-bottom-right-radius:4px}
.msg.assistant{margin-right:auto;color:var(--fog);
  background:linear-gradient(180deg,rgba(24,38,23,.82),rgba(14,21,13,.74));
  border:1px solid var(--line);border-bottom-left-radius:4px}
.msg.assistant.streaming::after{content:"\\258C";color:var(--orange);animation:blink 1s steps(1) infinite}
.msg.md{white-space:normal}
.msg.md .mdp{margin:0 0 10px;white-space:pre-wrap}
.msg.md > :last-child{margin-bottom:0}
.msg.md code{font-family:var(--mono);font-size:.9em;color:var(--orange-2);
  background:rgba(255,85,0,.09);border:1px solid rgba(255,85,0,.18);border-radius:5px;padding:1px 5px}
.msg.md a{color:var(--orange-2);text-decoration:underline;text-underline-offset:3px}
.msg.md strong{color:var(--fog);font-weight:600}
.msg.md .mdh{font-weight:600;color:var(--fog);margin:14px 0 8px;font-size:15.5px}
.msg.md .mdh:first-child{margin-top:0}
.msg.md .mdcode{font-family:var(--mono);font-size:12.5px;line-height:1.55;color:#d3dac8;
  background:rgba(0,0,0,.32);border:1px solid var(--line);border-radius:8px;
  padding:12px 14px;margin:0 0 10px;overflow-x:auto;white-space:pre}
.msg.md .mdlist{margin:0 0 10px;padding-left:22px}
.msg.md .mdlist li{margin:3px 0}
.msg.md .mdtable-wrap{overflow-x:auto;margin:0 0 10px;border:1px solid var(--line);border-radius:8px}
.msg.md .mdtable{border-collapse:collapse;width:100%;font-size:13px}
.msg.md .mdtable th{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;
  color:var(--ash);text-align:left;background:rgba(0,0,0,.25)}
.msg.md .mdtable th,.msg.md .mdtable td{padding:8px 12px;border-bottom:1px solid var(--line);vertical-align:top}
.msg.md .mdtable tr:last-child td{border-bottom:0}
@keyframes blink{50%{opacity:0}}

.pulse{display:flex;align-items:center;gap:10px;margin:14px 0;font-family:var(--mono);
font-size:12px;color:var(--dim)}
.pulse-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:640px}
.pulse-dot{width:8px;height:8px;border-radius:50%;background:var(--orange);
animation:pulsebeat 1.2s ease-in-out infinite}
@keyframes pulsebeat{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
.stepline{display:flex;align-items:center;gap:12px;margin:20px 0;font-family:var(--mono);
  font-size:10.5px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--ash)}
.stepline::before,.stepline::after{content:"";flex:1;height:1px;background:var(--line)}

/* ---- tool trace cards ---- */
details.tcard{margin:12px 0;border:1px solid var(--line-2);border-radius:12px;
  background:rgba(6,10,6,.82);overflow:hidden}
details.tcard>summary{display:flex;align-items:center;gap:10px;padding:11px 14px;cursor:pointer;
  list-style:none;font-family:var(--mono);font-size:12px;color:var(--dim);user-select:none}
details.tcard>summary::-webkit-details-marker{display:none}
details.tcard>summary::before{content:"\\25B8";color:var(--ash);flex:none;transition:transform .15s}
details.tcard[open]>summary::before{transform:rotate(90deg)}
.tcard .tw{color:var(--orange);font-weight:500;flex:none}
.tcard .tlabel{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--dim)}
.tcard .st{flex:none;font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
  border:1px solid;border-radius:999px;padding:3px 10px}
.st.run{color:var(--orange);border-color:rgba(255,85,0,.45);animation:pulse 2.4s ease-out infinite}
.st.ok{color:#93d6a6;border-color:rgba(147,214,166,.35)}
.st.err{color:#ff8b66;border-color:rgba(255,85,0,.5)}
.st.stall{color:#febc2e;border-color:rgba(254,188,46,.45)}
.tcard-body{border-top:1px solid var(--line)}
.tcard pre.code{font-size:12px;max-height:320px;overflow:auto}
.qline{padding:12px 16px;font-family:var(--mono);font-size:12.5px;color:var(--dim)}
.qline b{color:var(--orange-2);font-weight:500}
.qline .qf{color:var(--ash);margin-left:10px}

.hits{list-style:none;margin:0;padding:4px 0}
.hits li{display:flex;gap:10px;align-items:baseline;padding:8px 16px;border-top:1px solid var(--line);
  font-family:var(--mono);font-size:12px}
.hits li:first-child{border-top:0}
.hits .rank{color:var(--ash);flex:none;min-width:14px;text-align:right}
.hits .hid{color:var(--fog);overflow-wrap:anywhere;min-width:0}
.hits .hkind{flex:none;font-size:10.5px;color:var(--dim);border:1px solid var(--line);
  border-radius:999px;padding:1px 8px;white-space:nowrap}
.hits .hscore{flex:none;margin-left:auto;color:var(--orange-2)}
.hmeta{padding:9px 16px 12px;border-top:1px solid var(--line);font-family:var(--mono);
  font-size:11px;color:var(--ash)}

.osec{border-top:1px solid var(--line)}
.osec .oh{padding:10px 16px 0;font-family:var(--mono);font-size:10.5px;font-weight:500;
  letter-spacing:.2em;text-transform:uppercase;color:var(--ash)}
.osec.err .oh{color:#ff8b66}
.osec pre{margin:6px 0 0;padding:2px 16px 14px;font-family:var(--mono);font-size:12px;
  line-height:1.7;color:#d3dac8;white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow:auto}
.stall-note{padding:10px 16px;border-top:1px solid var(--line);font-family:var(--mono);
  font-size:11.5px;line-height:1.6;color:#febc2e}

/* ---- composer ---- */
.composer{position:sticky;bottom:0;z-index:3;padding:16px 0 20px;
  background:linear-gradient(180deg,transparent,var(--bg) 38%)}
.composer form{display:flex;gap:10px;align-items:flex-end;padding:10px;border-radius:14px;
  border:1px solid var(--line-2);background:rgba(6,10,6,.92);
  box-shadow:0 24px 60px -30px rgba(0,0,0,.8)}
.composer form:focus-within{border-color:rgba(255,85,0,.45)}
.composer textarea{flex:1;min-height:44px;max-height:170px;padding:9px 8px;background:transparent;
  border:0;outline:none;resize:vertical;color:var(--fog);font-family:var(--sans);
  font-size:14.5px;line-height:1.55}
.composer textarea::placeholder{color:var(--ash)}
.composer .btn-primary{padding:12px 18px}
.composer .btn-primary:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}
.sysnote{min-height:18px;margin-top:8px;font-family:var(--mono);font-size:11.5px;color:var(--ash)}
.sysnote.err{color:#ff8b66}
.sysnote a{color:var(--orange);text-decoration:underline;text-underline-offset:2px}

/* ---- locked state ---- */
.gate{padding:34px 0 8px;max-width:660px}
.gate h1{font-family:var(--display);font-weight:700;font-size:clamp(38px,6vw,62px);
  line-height:1.02;letter-spacing:-.022em;color:var(--fog);margin:16px 0 0}
.gate h1 .r{color:var(--orange);text-shadow:0 0 36px rgba(255,85,0,.35)}
.gate .cta{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:28px}
.gate .cta .hint{font-family:var(--mono);font-size:11.5px;color:var(--ash)}
.example{margin-top:54px}
.example .exhead{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:6px}
.example .exnote{font-family:var(--mono);font-size:11.5px;color:var(--ash)}

@media (max-width:680px){
  .pwrap{padding:0 16px}
  .msg{max-width:90%}
  .tcard .tlabel{display:none}
}
`;

// ---------------------------------------------------------------------------
// Inline client script (authenticated state only).
//
// Vanilla JS, no framework: keeps the chat history in an array replayed to
// POST /demo/chat each turn, parses the SSE stream with fetch + ReadableStream
// + TextDecoder, and renders every DemoFrame. All dynamic content enters the
// DOM via textContent — never innerHTML — so model/tool output can't inject
// markup. Defensive on stream shape (vercel/ai#10980 bug class): a turn that
// ends without `done` stalls its open cards and says so.
// ---------------------------------------------------------------------------

const DEMO_SCRIPT = `
(function(){
  "use strict";
  var log = document.getElementById("log");
  var form = document.getElementById("composer-form");
  var input = document.getElementById("composer-input");
  var sendBtn = document.getElementById("send");
  var note = document.getElementById("sysnote");
  if (!log || !form || !input || !sendBtn || !note) return;

  var history = [];
  var cards = {};
  var busy = false;
  // Liveness indicator: a reasoning model can sit silent for tens of seconds
  // before the first token/tool frame — without this, a working turn is
  // indistinguishable from a dead one.
  var pulse = null;
  var pulseT0 = 0;
  var pulseTimer = null;
  function showPulse(label){
    if (!pulse) {
      pulse = el("div", "pulse");
      pulse.appendChild(text("span", "pulse-dot", ""));
      pulse.appendChild(text("span", "pulse-label", ""));
      log.appendChild(pulse);
      pulseT0 = Date.now();
      pulseTimer = setInterval(function(){
        if (!pulse) return;
        var s = Math.floor((Date.now() - pulseT0) / 1000);
        pulse.lastChild.textContent = pulse.dataset.label + " \\u00b7 " + s + "s";
      }, 1000);
    }
    pulse.dataset.label = label;
    pulse.lastChild.textContent = label;
    if (pulse !== log.lastChild) log.appendChild(pulse);
    scrollEnd();
  }
  function hidePulse(){
    if (pulseTimer) { clearInterval(pulseTimer); pulseTimer = null; }
    if (pulse && pulse.parentNode) pulse.parentNode.removeChild(pulse);
    pulse = null;
  }
  var turnDone = false;
  var current = null;
  var acc = "";
  var thinkTail = "";

  function el(tag, cls){ var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function text(tag, cls, s){ var n = el(tag, cls); n.textContent = s; return n; }
  function scrollEnd(){ window.scrollTo(0, document.body.scrollHeight); }
  function setNote(msg, kind){ note.textContent = msg || ""; note.className = "sysnote" + (kind ? " " + kind : ""); }
  function pretty(v){
    if (typeof v === "string") return v;
    try { return JSON.stringify(v, null, 2); } catch (e) { return String(v); }
  }

  // Tiny safe markdown: DOM nodes only, every piece of model text lands via
  // textContent / createTextNode — no innerHTML, no sanitizer needed. Kumo /
  // streamdown are React-bound and this page is a hash-pinned inline script,
  // so this stays hand-rolled. Coverage: fenced code, tables, lists,
  // headings, paragraphs; inline code/bold/italic/links (http(s) or
  // same-origin path only). Unrecognized syntax degrades to plain text.
  var MD_INLINE = /(\`[^\`\\n]+\`)|(\\*\\*[^*\\n]+\\*\\*)|(\\*[^*\\n]+\\*)|(\\[[^\\]\\n]+\\]\\((?:https?:\\/\\/|\\/)[^\\s)]+\\))/g;
  function mdInline(node, s){
    var last = 0, m;
    MD_INLINE.lastIndex = 0;
    while ((m = MD_INLINE.exec(s))) {
      if (m.index > last) node.appendChild(document.createTextNode(s.slice(last, m.index)));
      var t = m[0];
      if (m[1]) node.appendChild(text("code", "", t.slice(1, -1)));
      else if (m[2]) node.appendChild(text("strong", "", t.slice(2, -2)));
      else if (m[3]) node.appendChild(text("em", "", t.slice(1, -1)));
      else {
        var cut = t.lastIndexOf("](");
        var a = text("a", "", t.slice(1, cut));
        a.href = t.slice(cut + 2, -1);
        a.rel = "noopener noreferrer";
        a.target = "_blank";
        node.appendChild(a);
      }
      last = m.index + t.length;
    }
    if (last < s.length) node.appendChild(document.createTextNode(s.slice(last)));
  }
  function mdCells(line){
    var t = line.trim();
    if (t.charAt(0) === "|") t = t.slice(1);
    if (t.charAt(t.length - 1) === "|") t = t.slice(0, -1);
    return t.split("|").map(function(c){ return c.trim(); });
  }
  var MD_TABLE_SEP = /^\\s*\\|?[\\s:|-]+\\|[\\s:|-]*$/;
  var MD_LIST = /^\\s*(?:[-*+]|\\d+[.)])\\s+/;
  function renderMarkdown(s){
    var frag = document.createDocumentFragment();
    var lines = String(s).split("\\n");
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (line.slice(0, 3) === "\`\`\`") {
        var buf = [];
        i++;
        while (i < lines.length && lines[i].slice(0, 3) !== "\`\`\`") { buf.push(lines[i]); i++; }
        i++;
        frag.appendChild(text("pre", "mdcode", buf.join("\\n")));
        continue;
      }
      var h = /^(#{1,4})\\s+(.*)$/.exec(line);
      if (h) {
        var hn = el("div", "mdh mdh" + h[1].length);
        mdInline(hn, h[2]);
        frag.appendChild(hn);
        i++;
        continue;
      }
      if (line.indexOf("|") >= 0 && i + 1 < lines.length && MD_TABLE_SEP.test(lines[i + 1])) {
        var wrap = el("div", "mdtable-wrap");
        var tbl = el("table", "mdtable");
        var tr = el("tr");
        mdCells(line).forEach(function(c){ var n = el("th"); mdInline(n, c); tr.appendChild(n); });
        tbl.appendChild(tr);
        i += 2;
        while (i < lines.length && lines[i].trim() && lines[i].indexOf("|") >= 0) {
          var row = el("tr");
          mdCells(lines[i]).forEach(function(c){ var n = el("td"); mdInline(n, c); row.appendChild(n); });
          tbl.appendChild(row);
          i++;
        }
        wrap.appendChild(tbl);
        frag.appendChild(wrap);
        continue;
      }
      if (MD_LIST.test(line)) {
        var lst = el(/^\\s*\\d/.test(line) ? "ol" : "ul", "mdlist");
        while (i < lines.length && MD_LIST.test(lines[i])) {
          var li = el("li");
          mdInline(li, lines[i].replace(MD_LIST, ""));
          lst.appendChild(li);
          i++;
        }
        frag.appendChild(lst);
        continue;
      }
      var pbuf = [line];
      i++;
      while (i < lines.length && lines[i].trim() &&
             lines[i].slice(0, 3) !== "\`\`\`" && !/^#{1,4}\\s/.test(lines[i]) && !MD_LIST.test(lines[i]) &&
             !(lines[i].indexOf("|") >= 0 && i + 1 < lines.length && MD_TABLE_SEP.test(lines[i + 1]))) {
        pbuf.push(lines[i]);
        i++;
      }
      var p = el("p", "mdp");
      mdInline(p, pbuf.join("\\n"));
      frag.appendChild(p);
    }
    return frag;
  }
  function setBubbleMarkdown(node, s){
    node.textContent = "";
    node.appendChild(renderMarkdown(s));
  }

  function addBubble(role, s){
    var b = text("div", "msg " + role, s);
    log.appendChild(b);
    scrollEnd();
    return b;
  }

  function section(card, label, body, mod){
    var s = el("div", "osec" + (mod ? " " + mod : ""));
    s.appendChild(text("div", "oh", label));
    var p = el("pre", "");
    p.textContent = body;
    s.appendChild(p);
    card.body.appendChild(s);
  }

  function startCard(f){
    var inp = (f.input && typeof f.input === "object") ? f.input : {};
    var d = el("details", "tcard");
    var sum = el("summary");
    sum.appendChild(text("span", "tw", f.tool));
    sum.appendChild(text("span", "tlabel",
      f.tool === "search" && typeof inp.query === "string" ? JSON.stringify(inp.query) : "sandboxed JavaScript"));
    var badge = text("span", "st run", "running");
    sum.appendChild(badge);
    d.appendChild(sum);
    var body = el("div", "tcard-body");
    var wait = null;
    if (f.tool === "search") {
      var q = el("div", "qline");
      q.appendChild(document.createTextNode("query "));
      q.appendChild(text("b", "", typeof inp.query === "string" ? inp.query : pretty(f.input)));
      var filters = [];
      if (inp.kind) filters.push("kind=" + inp.kind);
      if (inp.service) filters.push("service=" + inp.service);
      if (inp.limit) filters.push("limit=" + inp.limit);
      if (filters.length) q.appendChild(text("span", "qf", filters.join(" ")));
      body.appendChild(q);
    } else {
      wait = text("div", "qline", "Running code\\u2026");
      body.appendChild(wait);
      var pre = el("pre", "code");
      pre.textContent = typeof inp.code === "string" ? inp.code : pretty(f.input);
      body.appendChild(pre);
    }
    d.appendChild(body);
    log.appendChild(d);
    cards[f.id] = { body: body, badge: badge, tool: f.tool, wait: wait, resolved: false };
    scrollEnd();
  }

  function fillCard(f){
    var c = cards[f.id];
    if (!c) { startCard({ id: f.id, tool: f.tool, input: {} }); c = cards[f.id]; }
    c.resolved = true;
    if (c.wait && c.wait.parentNode) { c.wait.parentNode.removeChild(c.wait); c.wait = null; }
    c.badge.textContent = f.ok ? "ok" : "error";
    c.badge.className = "st " + (f.ok ? "ok" : "err");
    var out = f.output;
    if (c.tool === "search" && out && typeof out === "object" && Array.isArray(out.hits)) {
      var ol = el("ol", "hits");
      for (var i = 0; i < out.hits.length; i++) {
        var h = out.hits[i] || {};
        var li = el("li");
        li.appendChild(text("span", "rank", String(i + 1)));
        li.appendChild(text("span", "hid", String(h.id == null ? "" : h.id)));
        li.appendChild(text("span", "hkind", String(h.kind == null ? "" : h.kind)));
        li.appendChild(text("span", "hscore",
          (h.score == null ? "" : String(h.score)) + (h.tier === "backfill" ? " \\u00b7 backfill" : "")));
        ol.appendChild(li);
      }
      c.body.appendChild(ol);
      var meta = [];
      if (typeof out.total === "number") meta.push(out.hits.length + " of " + out.total + " matches");
      if (out.truncated) meta.push("truncated \\u2014 more matched than shown");
      if (!out.hits.length) meta.push("0 hits \\u2014 inconclusive, not evidence of absence");
      if (meta.length) c.body.appendChild(text("div", "hmeta", meta.join(" \\u00b7 ")));
    } else if (c.tool === "execute" && out && typeof out === "object") {
      var any = false;
      if (out.result !== undefined && out.result !== null) { section(c, "result", pretty(out.result)); any = true; }
      var logs = out.logs;
      if (Array.isArray(logs) && logs.length) { section(c, "console", logs.join("\\n")); any = true; }
      else if (typeof logs === "string" && logs) { section(c, "console", logs); any = true; }
      if (out.error !== undefined && out.error !== null) { section(c, "error", pretty(out.error), "err"); any = true; }
      if (!any) section(c, f.ok ? "output" : "error", pretty(out), f.ok ? "" : "err");
    } else {
      section(c, f.ok ? "output" : "error", pretty(out), f.ok ? "" : "err");
    }
    scrollEnd();
  }

  // Design requirement: a tool-start with no tool-result by done/error is
  // rendered STALLED — never left "running", never guessed at.
  function stallOpenCards(){
    for (var id in cards) {
      var c = cards[id];
      if (c.resolved) continue;
      c.resolved = true;
      if (c.wait && c.wait.parentNode) { c.wait.parentNode.removeChild(c.wait); c.wait = null; }
      c.badge.textContent = "stalled";
      c.badge.className = "st stall";
      c.body.appendChild(text("div", "stall-note",
        "No result frame arrived for this call before the stream ended \\u2014 unresolved, not failed."));
    }
  }

  function finishTurn(){
    hidePulse();
    if (current) current.classList.remove("streaming");
    if (acc) history.push({ role: "assistant", content: acc });
    current = null;
    acc = "";
    busy = false;
    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }

  function handleFrame(f){
    if (!f || typeof f.type !== "string") return;
    if (f.type === "ready") {
      showPulse("model reasoning");
    } else if (f.type === "thinking") {
      thinkTail = (thinkTail + String(f.text == null ? "" : f.text)).slice(-90).replace(/\\s+/g, " ");
      showPulse("thinking \\u00b7 " + thinkTail);
    } else if (f.type === "token") {
      hidePulse();
      if (!current) { current = addBubble("assistant", ""); current.classList.add("streaming"); current.classList.add("md"); }
      acc += String(f.text == null ? "" : f.text);
      setBubbleMarkdown(current, acc);
      scrollEnd();
    } else if (f.type === "tool-start") {
      hidePulse();
      startCard(f);
    } else if (f.type === "tool-result") {
      fillCard(f);
      showPulse("model reasoning over the result");
    } else if (f.type === "step") {
      hidePulse();
      log.appendChild(text("div", "stepline", "step " + f.index));
      showPulse("model reasoning");
    } else if (f.type === "done") {
      turnDone = true;
      hidePulse();
      stallOpenCards();
      if (f.reason === "length") {
        setNote(acc ? "The answer hit the demo's output-token limit and was cut off."
          : "The model spent its whole output budget reasoning and produced no answer \\u2014 try a simpler question.", "err");
      } else if (f.reason && f.reason !== "stop" && !acc) {
        setNote("The turn ended (" + f.reason + ") without a text answer \\u2014 the trace above shows what ran.", "err");
      }
      finishTurn();
    } else if (f.type === "error") {
      turnDone = true;
      hidePulse();
      stallOpenCards();
      setNote(String(f.message || "stream error"), "err");
      finishTurn();
    }
  }

  async function send(msg){
    busy = true;
    turnDone = false;
    thinkTail = "";
    sendBtn.disabled = true;
    input.disabled = true;
    setNote("");
    history.push({ role: "user", content: msg });
    addBubble("user", msg);
    showPulse("sending");
    var res;
    try {
      res = await fetch("/demo/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history })
      });
    } catch (e) {
      hidePulse();
      setNote("Network error \\u2014 the message stays in your history; send again to retry.", "err");
      busy = false; sendBtn.disabled = false; input.disabled = false;
      return;
    }
    if (!res.ok || !res.body) {
      hidePulse();
      setNote(res.status === 401 ? "Session expired \\u2014 reload this page to sign in again."
        : res.status === 429 ? "Hourly chat limit reached \\u2014 try again in a bit."
        : "Request failed (" + res.status + ").", "err");
      busy = false; sendBtn.disabled = false; input.disabled = false;
      return;
    }
    var reader = res.body.getReader();
    var dec = new TextDecoder();
    var buf = "";
    try {
      for (;;) {
        var r = await reader.read();
        if (r.done) break;
        buf += dec.decode(r.value, { stream: true });
        var idx;
        while ((idx = buf.indexOf("\\n\\n")) >= 0) {
          var lines = buf.slice(0, idx).split("\\n");
          buf = buf.slice(idx + 2);
          for (var i = 0; i < lines.length; i++) {
            if (lines[i].slice(0, 5) !== "data:") continue;
            var frame = null;
            try { frame = JSON.parse(lines[i].slice(5)); } catch (e) { continue; }
            handleFrame(frame);
          }
        }
      }
    } catch (e) { /* fall through to the no-done check */ }
    if (!turnDone) {
      stallOpenCards();
      setNote("The stream ended without a done frame \\u2014 this turn may be incomplete.", "err");
      finishTurn();
    }
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();
    if (busy) return;
    var v = input.value.trim();
    if (!v) return;
    input.value = "";
    send(v);
  });
  input.addEventListener("keydown", function(e){
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (form.requestSubmit) form.requestSubmit();
    }
  });
  input.focus();
})();
`;

// CSP script allowance: the sha256 hash of DEMO_SCRIPT exactly as it appears
// inside the single inline <script> element — no 'unsafe-inline'. The hash is
// hard-coded (Web Crypto is async, and these headers are a sync module const);
// test/demo-page.test.ts recomputes it from the rendered page, so an edit to
// DEMO_SCRIPT fails the suite with the new value to paste here.
const DEMO_SCRIPT_SHA256 = "sha256-8sWM6T+NEhg7YrX00pt4h5WmM4tptSBCVkg3WqjCbbQ=";

export const DEMO_PAGE_HEADERS: Record<string, string> = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "no-store",
  "x-robots-tag": "noindex",
  "content-security-policy":
    `default-src 'none'; script-src '${DEMO_SCRIPT_SHA256}'; style-src 'unsafe-inline'; ` +
    "font-src data:; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; " +
    "base-uri 'none'; form-action 'none'",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

// ---------------------------------------------------------------------------
// Static example trace (locked state) — hard-coded sample data in the SAME
// markup the client script builds. Hits/scores/total are a real
// searchCatalogPage("soroban smart contract deploy", limit 4) page against
// the current catalog; the playbook text quotes the real skill section.
// ADR-0003: only exposed operations/skills appear here.
// ---------------------------------------------------------------------------

const SAMPLE_QUERY = "soroban smart contract deploy";

const SAMPLE_HITS: Array<{ id: string; kind: string; score: number }> = [
  { id: "stellarDocs.search_soroban_contract_docs", kind: "operation", score: 281 },
  { id: "skills.stellar-dev.smart-contracts", kind: "skill", score: 237 },
  { id: "skills.stellar-dev.smart-contracts#build-deploy-invoke", kind: "skill-section", score: 162 },
  { id: "stellarDocs.search_docs", kind: "operation", score: 105 }
];

const SAMPLE_CODE = `async () => {
  const [skill, docs] = await Promise.all([
    codemode.skill.read("skills.stellar-dev.smart-contracts", { sections: ["build-deploy-invoke"] }),
    stellarDocs.search_soroban_contract_docs({ query: "deploy to testnet", hitsPerPage: 3 })
  ]);
  return {
    playbook: skill.ok ? skill.sections : skill.error,
    docs: docs.ok ? docs.data.hits.map(h => ({ url: h.url, snippet: h.snippet })) : docs.error
  };
}`;

const SAMPLE_RESULT = `{
  "playbook": {
    "build-deploy-invoke": "## Build, deploy, invoke\\n\\n\`\`\`bash\\n# Build optimized WASM → target/wasm32-unknown-unknown/release/*.wasm\\nstellar contract build\\n\\n# Create and fund an identity (testnet)\\nstellar keys generate --global alice --network testnet --fund\\n\\n# Deploy (constructor args go after the \`--\`)\\nstellar contract deploy \\\\\\n  --wasm target/wasm32-unknown-unknown/release/my_contract.wasm \\\\\\n  --source alice \\\\\\n  --network testnet\\n\`\`\`\\n\\nTo upload WASM without instantiating (e.g. for factories or upgrades), use \`stellar contract upload\` …"
  },
  "docs": [
    {
      "url": "https://developers.stellar.org/docs/build/smart-contracts/getting-started/deploy-to-testnet",
      "snippet": "Deploy the compiled contract to Testnet with the Stellar CLI …"
    },
    {
      "url": "https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup",
      "snippet": "Install Rust, the wasm32 target, and the Stellar CLI before your first build …"
    }
  ]
}`;

const SAMPLE_USER = "How do I deploy a Soroban smart contract to testnet?";

const SAMPLE_ANSWER =
  "Build the WASM with `stellar contract build`, create and fund a testnet identity " +
  "(`stellar keys generate --global alice --network testnet --fund`), then deploy it: " +
  "`stellar contract deploy --wasm target/wasm32-unknown-unknown/release/my_contract.wasm " +
  "--source alice --network testnet` — constructor args go after the `--`. The " +
  "build-deploy-invoke playbook section and the getting-started docs above walk the same " +
  "flow end to end, including invoking the deployed contract.";

function sampleTrace(): string {
  const hits = SAMPLE_HITS.map(
    (h, i) =>
      `<li><span class="rank">${i + 1}</span><span class="hid">${esc(h.id)}</span>` +
      `<span class="hkind">${esc(h.kind)}</span><span class="hscore">${h.score}</span></li>`
  ).join("");
  return (
    `<div class="msg user">${esc(SAMPLE_USER)}</div>` +
    `<div class="stepline">step 1</div>` +
    `<details class="tcard" open><summary><span class="tw">search</span>` +
    `<span class="tlabel">${esc(JSON.stringify(SAMPLE_QUERY))}</span>` +
    `<span class="st ok">ok</span></summary><div class="tcard-body">` +
    `<div class="qline">query <b>${esc(SAMPLE_QUERY)}</b><span class="qf">limit=4</span></div>` +
    `<ol class="hits">${hits}</ol>` +
    `<div class="hmeta">4 of 46 matches &middot; truncated &mdash; more matched than shown</div>` +
    `</div></details>` +
    `<div class="stepline">step 2</div>` +
    `<details class="tcard" open><summary><span class="tw">execute</span>` +
    `<span class="tlabel">sandboxed JavaScript</span>` +
    `<span class="st ok">ok</span></summary><div class="tcard-body">` +
    `<pre class="code">${esc(SAMPLE_CODE)}</pre>` +
    `<div class="osec"><div class="oh">result</div><pre>${esc(SAMPLE_RESULT)}</pre></div>` +
    `</div></details>` +
    `<div class="msg assistant">${esc(SAMPLE_ANSWER)}</div>`
  );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

const EXPLAINER =
  "Type a question and a small tool-calling model works it the way any connected agent " +
  "would: it searches Raven’s unified catalog, writes JavaScript against the operations " +
  "it finds, and runs that code in the no-network sandbox — every call rendered as an " +
  "inspectable trace. The playground runs the same server-side search and execute " +
  "implementations that back /mcp (same catalog, same sandbox, same result envelopes); it " +
  "does not exercise the MCP OAuth transport — signing in starts an ordinary browser " +
  "session.";

function demoHead(): string {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Playground &middot; Stellar Raven</title>
<meta name="description" content="Watch an agent drive Stellar Raven's search and execute tools live."/>
<meta name="robots" content="noindex"/>
<meta name="theme-color" content="#0e150d"/>
<meta name="color-scheme" content="dark"/>
<link rel="icon" href="${FAVICON}"/>
<style>${FONT_FACE}${TOKENS}${BASE}${DEMO_CSS}</style>
</head><body>`;
}

function topBar(): string {
  return (
    `<div class="stage"></div><div class="scrim"></div>` +
    `<header class="top"><div class="pwrap top-in">` +
    `<a class="brand" href="/">${ravenSvg("rv")}<span class="wm"><b>Stellar Raven</b><i>playground</i></span></a>` +
    `<span class="end"><a class="btn btn-ghost" href="/">raven home</a></span>` +
    `</div></header>`
  );
}

function lockedBody(): string {
  return (
    `<main class="play pwrap"><section class="gate">` +
    `<p class="eyebrow">Agent playground <span class="live"><span class="dot"></span>live tools</span></p>` +
    `<h1>Watch an agent <span class="r">work Raven.</span></h1>` +
    `<p class="lede">${esc(EXPLAINER)}</p>` +
    `<div class="cta"><a class="btn btn-primary" href="/demo/login">Sign in to try it</a>` +
    `<span class="hint">WorkOS sign-in &middot; no API keys &middot; rate-limited</span></div>` +
    `</section>` +
    `<section class="example"><div class="exhead"><p class="eyebrow">Example session</p>` +
    `<span class="exnote">static sample &mdash; sign in to run your own</span></div>` +
    sampleTrace() +
    `</section></main>`
  );
}

function chatBody(): string {
  return (
    `<main class="play pwrap">` +
    `<p class="fineprint"><b>Live tools.</b> Every card below is a real call into the same ` +
    `server-side <code>search</code> and <code>execute</code> implementations that back ` +
    `<code>/mcp</code> (MCP OAuth transport not exercised). Envelopes render as returned: ` +
    `<code>ok/data</code> or <code>error.kind</code> of <code>"error"</code> or ` +
    `<code>"soft-empty"</code> &mdash; soft-empty means the service answered with nothing, ` +
    `which is inconclusive, not proof of absence.</p>` +
    `<div id="log" aria-live="polite"></div>` +
    `<div class="composer"><form id="composer-form">` +
    // maxlength mirrors DEMO_CAPS.maxUserMessageChars (src/demo/budget.ts);
    // the server clamps regardless — this just fails early in the UI.
    `<textarea id="composer-input" maxlength="4000" rows="1" ` +
    `placeholder="Ask about the Stellar ecosystem…" ` +
    `aria-label="Message the playground agent"></textarea>` +
    `<button id="send" class="btn btn-primary" type="submit">Send</button>` +
    `</form><div id="sysnote" class="sysnote"></div></div>` +
    `</main>` +
    `<script>${DEMO_SCRIPT}</script>`
  );
}

export function demoPage(opts: { authenticated: boolean }): string {
  return demoHead() + topBar() + (opts.authenticated ? chatBody() : lockedBody()) + `</body></html>`;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
