/**
 * Tiny auto-escaping HTML template helper.
 *
 * The site and playground pages are server-rendered as strings inlined into a
 * Worker response — no framework, no client bundle. That keeps the strict CSP
 * (a single pinned script hash) easy to reason about, but hand-concatenating
 * markup with manual `escapeHtml(...)` calls is a footgun: forget one and you
 * have an injection or a broken page.
 *
 * `html` closes that gap. Interpolated values are escaped by default; only
 * values you explicitly wrap in `raw(...)` (or another `html` result) are
 * emitted as trusted markup. Composition is safe: nesting `${html`…`}` does
 * NOT double-escape, because `html` returns a `RawHtml` the outer template
 * recognises.
 *
 *   html`<p class="lede">${userText}</p>`            // userText is escaped
 *   html`<ul>${items.map((i) => html`<li>${i}</li>`)}</ul>`  // list composes
 *   html`<div>${raw(prebuiltMarkup)}</div>`          // opt out for known-safe HTML
 *
 * Interpolation rules:
 *   - string            → escaped
 *   - number            → String(n), unescaped (digits are always safe)
 *   - RawHtml           → emitted verbatim (from `raw()` or a nested `html`)
 *   - array             → each element rendered by these same rules, joined
 *   - null / undefined  → "" (so `cond ? html`…` : null` renders nothing)
 *   - boolean           → "" (so the `cond && html`…`` guard renders nothing)
 */

/** Marks a string as already-safe HTML so `html` emits it without escaping. */
export class RawHtml {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

/** Wrap known-safe HTML so it passes through `html` interpolation unescaped. */
export function raw(value: string): RawHtml {
  return new RawHtml(value);
}

/** Escape the five HTML-significant characters. The canonical project escaper. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export type Html = RawHtml | string | number | boolean | null | undefined | Html[];

function render(value: Html): string {
  if (value == null || typeof value === "boolean") return "";
  if (value instanceof RawHtml) return value.value;
  if (Array.isArray(value)) {
    let out = "";
    for (const item of value) out += render(item);
    return out;
  }
  if (typeof value === "number") return String(value);
  return escapeHtml(value);
}

/**
 * Tagged template that auto-escapes interpolations. Returns `RawHtml` so
 * results compose without double-escaping; call `.toString()` (or coerce with
 * `+`/`String(...)`) at the response boundary to get the final string.
 */
export function html(strings: TemplateStringsArray, ...values: Html[]): RawHtml {
  let out = strings[0] ?? "";
  for (let i = 0; i < values.length; i++) {
    out += render(values[i]) + (strings[i + 1] ?? "");
  }
  return new RawHtml(out);
}
