# Reproduce batch 2 registry audit

Sources are preserved unchanged in `../../../assets/dithercn/*.json` and `../../../assets/shadcn/*.json`, with MIT license files alongside. `src/main.tsx`, `src/lib/utils.ts` and `input.css` are audit integration code. They supply host tokens, size constraints, Tailwind v4 and the `cn` helper. Reference pages are linked in each `../../../previews/<id>/audit.json`.

From the repository root:

```sh
python3 zod-ui-catalog/scripts/prepare_batch2.py --offline
cd zod-ui-catalog/audits/batch-2/fixture
npm ci
./node_modules/.bin/esbuild src/main.tsx --bundle --jsx=automatic --alias:@="$PWD/src" --alias:@/registry/new-york-v4/ui="$PWD/src/components/ui" --alias:cn="$PWD/src/lib/utils.ts" --outfile=bundle.js
./node_modules/.bin/tailwindcss -i input.css -o output.css --minify
python3 -m http.server 8769 --bind 127.0.0.1
```

The audit runner is `scripts/audit_batch2.py` (relative to catalog root). It accepts `--browser-executable`, `--base-url`, and a comma-separated `--only` list. Install Python `playwright` and `Pillow` in an isolated environment first. It creates screenshots and state evidence, never assigns a tier. Manual classifications are stored separately in `../manual-review.json` before publication.

For each component, original page and local fixture use 1440×900 and 390×844 viewports. Shaders inherit source theme tokens and use the same measured surface size; no source pixels are injected into the local render. Reduced-motion freezes shader motion. Full viewport evidence and original/local component surfaces are retained. A crop of at most two raster pixels at the edge accommodates fractional screenshot bounds; images are never rescaled for pixel comparison. Nonmatching component dimensions are marked incomparable rather than stretched.

UI examples retain their original source code. Host font differs from the official Geist font; font/theme normalization and the `cn` import alias are integration work, recorded in Tier A limitations. Runtime and keyboard state checks apply only to the demo exercised; there is no complete WCAG certification or business-flow test.
