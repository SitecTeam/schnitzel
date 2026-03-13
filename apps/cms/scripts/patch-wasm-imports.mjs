/**
 * Post-build patch for Windows compatibility and bundle size reduction.
 *
 * Problems solved:
 *
 * 1. WINDOWS PATH BUG: OpenNext generates absolute Windows paths with `?module`
 *    suffixes for WASM imports, e.g. `import resvg_wasm from "C:/...resvg.wasm?module"`.
 *    On Windows `?` is an illegal filename character, so wrangler/esbuild fails.
 *    Fix: replace with relative paths (no suffix). The `CompiledWasm` rule in
 *    wrangler.json tells wrangler how to handle .wasm imports.
 *
 * 2. BUNDLE SIZE: Next.js bundles @vercel/og's resvg.wasm (1.35 MB) and yoga.wasm
 *    (87 KB) into the worker. Payload CMS never uses OG image generation, so these
 *    are dead weight. We stub them with minimal valid WASM (8 bytes each) and
 *    neutralize the initialization calls to prevent runtime errors.
 */

import { readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { join } from "path";

const handlerPath = join(
  process.cwd(),
  ".open-next/server-functions/default/apps/cms/handler.mjs"
);

if (!existsSync(handlerPath)) {
  console.log("⚠ handler.mjs not found – skipping patch");
  process.exit(0);
}

let content = readFileSync(handlerPath, "utf-8");

// handler.mjs lives at: .open-next/server-functions/default/apps/cms/handler.mjs
// WASM files live at:   .open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og/*.wasm
// Relative path from apps/cms/ to server-functions/default/: ../../
const patches = [
  {
    name: "resvg.wasm import path",
    pattern: /import resvg_wasm from"[^"]*resvg\.wasm(?:\?module)?"/,
    replacement:
      'import resvg_wasm from"../../node_modules/next/dist/compiled/@vercel/og/resvg.wasm"',
  },
  {
    name: "yoga.wasm import path",
    pattern: /import yoga_wasm from"[^"]*yoga\.wasm(?:\?module)?"/,
    replacement:
      'import yoga_wasm from"../../node_modules/next/dist/compiled/@vercel/og/yoga.wasm"',
  },
  {
    // Neutralize initWasm/initYoga — they try to instantiate the WASM at module
    // load time. Since we stub the WASM files, this would fail. Replace with
    // no-op resolved promises so ImageResponse is never actually usable, but
    // the worker starts fine. Payload CMS never calls ImageResponse anyway.
    name: "initWasm/initYoga no-ops",
    pattern:
      /initializedResvg=initWasm\(resvg_wasm\),initializedYoga=initYoga\(yoga_wasm\)\.then\(\w+=>\w+\(\w+\)\)/,
    replacement:
      "initializedResvg=Promise.resolve(),initializedYoga=Promise.resolve()",
  },
];

let patched = false;
for (const { name, pattern, replacement } of patches) {
  if (pattern.test(content)) {
    content = content.replace(pattern, replacement);
    console.log(`✓ Patched: ${name}`);
    patched = true;
  } else {
    console.log(`– Not found (already patched?): ${name}`);
  }
}

if (patched) {
  writeFileSync(handlerPath, content, "utf-8");
  console.log("✓ handler.mjs written");
}

// Stub the WASM files with minimal valid WebAssembly (8 bytes: magic + version).
// This is valid WASM that instantiates as an empty module, reducing the binary
// from ~1.35 MB + 87 KB to 8 bytes each, saving ~1+ MB from the compressed upload.
const wasmDir = join(
  process.cwd(),
  ".open-next/server-functions/default/node_modules/next/dist/compiled/@vercel/og"
);
const minimalWasm = Buffer.from([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
]);

for (const name of ["resvg.wasm", "yoga.wasm"]) {
  const wasmPath = join(wasmDir, name);
  if (existsSync(wasmPath)) {
    const originalSize = statSync(wasmPath).size;
    writeFileSync(wasmPath, minimalWasm);
    console.log(
      `✓ Stubbed ${name} (${Math.round(originalSize / 1024)} KB → 8 bytes)`
    );
  } else {
    console.log(`– ${name} not found at expected path`);
  }
}
