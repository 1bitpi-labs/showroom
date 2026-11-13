# Isolated registry fixture

Original Aurora/Waves/dither-core sources are preserved in `../../assets/dithercn/*.json`, with MIT attribution in `../../assets/dithercn/LICENSE`. `src/main.tsx` and styles are an original audit harness. The fixture supplies equivalent styles for the audited surface, tokens and a shadcn `cn` utility; it is not a complete Tailwind integration test.

To reproduce from this directory:

```sh
python3 prepare.py
npm ci
./node_modules/.bin/esbuild src/main.tsx --bundle --jsx=automatic --alias:@="$PWD/src" --outfile=bundle.js
python3 -m http.server 8768 --bind 127.0.0.1
```

Open `/?component=aurora` or `/?component=waves`. The server is for browser auditing only. Registry source files materialized by prepare.py and bundle.js are generated outputs.
