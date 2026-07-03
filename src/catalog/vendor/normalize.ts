/**
 * VENDORED from @cloudflare/codemode@0.4.2
 *   upstream source: src/normalize.ts (`normalizeCode` + `stripCodeFences`;
 *   shipped as part of dist/json-schema-types-D_m9tVnI.js in the published
 *   package)
 *
 * Why vendored instead of imported (same rationale as the sibling files):
 *   1. `normalizeCode` IS exported upstream, but only through the package's
 *      main entry (`dist/index.js`), which imports `cloudflare:workers` and
 *      therefore cannot be loaded from plain Node — and the spec-sandbox
 *      source generator (src/executor/spec-sandbox.ts) must be importable
 *      from vitest.
 *   2. The Node-safe `@cloudflare/codemode/mcp` entry uses it internally but
 *      does not re-export it, and the shared chunk filename is hashed.
 *
 * Changes from upstream: TypeScript annotations added; no behavior changes.
 */
import * as acorn from "acorn";

/**
 * Strip markdown code fences that LLMs commonly wrap code in.
 * Handles ```js, ```javascript, ```typescript, ```ts, or bare ```.
 */
function stripCodeFences(code: string): string {
  const match = code.match(/^```(?:js|javascript|typescript|ts|tsx|jsx)?\s*\n([\s\S]*?)```\s*$/);
  return match?.[1] ?? code;
}

/**
 * Normalize LLM-written code into the `async () => { ... }` arrow-function
 * expression the sandbox wrapper invokes: strips fences, unwraps
 * `export default`, wraps bare statements / named functions, and returns the
 * source untouched when it is already a single arrow-function expression.
 */
export function normalizeCode(code: string): string {
  const trimmed = stripCodeFences(code.trim());
  if (!trimmed.trim()) return "async () => {}";
  const source = trimmed.trim();
  try {
    const ast = acorn.parse(source, {
      ecmaVersion: "latest",
      sourceType: "module"
    });
    if (ast.body.length === 1 && ast.body[0]!.type === "ExpressionStatement") {
      if (ast.body[0].expression.type === "ArrowFunctionExpression") return source;
    }
    if (ast.body.length === 1 && ast.body[0]!.type === "ExportDefaultDeclaration") {
      const decl = ast.body[0].declaration;
      const inner = source.slice(decl.start, decl.end);
      if (decl.type === "FunctionDeclaration" && !decl.id) return `async () => {\nreturn (${inner})();\n}`;
      if (decl.type === "ClassDeclaration" && !decl.id) return `async () => {\nreturn (${inner});\n}`;
      return normalizeCode(inner);
    }
    if (ast.body.length === 1 && ast.body[0]!.type === "FunctionDeclaration") {
      return `async () => {\n${source}\nreturn ${ast.body[0].id?.name ?? "fn"}();\n}`;
    }
    const last = ast.body[ast.body.length - 1];
    if (last?.type === "ExpressionStatement") {
      const exprStmt = last;
      return `async () => {\n${source.slice(0, last.start)}return (${source.slice(exprStmt.expression.start, exprStmt.expression.end)})\n}`;
    }
    return `async () => {\n${source}\n}`;
  } catch {
    return `async () => {\n${source}\n}`;
  }
}
