# UI Extractor

Extract UI components, design tokens, and patterns from any website. Generate production-ready React, Vue, and HTML components. Includes CLI and MCP server for AI agent integration.

[![Status: Active](https://img.shields.io/badge/Status-Active-green.svg?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)]()

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Agent Rules](#agent-rules)
- [License](#license)

## Features

- **Extract** — DOM, CSS variables, computed styles, images, screenshots (full page, viewport, mobile, sections, components)
- **Analyze** — Pattern detection, design system extraction (colors, spacing, radius, fonts), component classification
- **Spec** — Generate component specifications (props, states, accessibility, responsive breakpoints)
- **Generate** — Output HTML, React, or Vue components with CSS/SCSS/Tailwind
- **Pipeline** — Full extract → analyze → spec → generate in one command
- **Learn** — Save any site as a reference for future regeneration
- **MCP Server** — Integrate with Cursor, Claude, Windsurf, VS Code

## Tech Stack

- **Language** — TypeScript (ESM)
- **Runtime** — Node.js 20+
- **Package Manager** — pnpm 9+
- **Browser Automation** — Playwright
- **CLI Framework** — Commander.js
- **MCP SDK** — @modelcontextprotocol/sdk
- **Testing** — Vitest
- **Linting** — ESLat 9+ with custom rules (STD-DOC-002, STD-DOC-003)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 9 or higher

### Installation

```bash
git clone https://github.com/stsgs1980/ui-extractor.git
cd ui-extractor
pnpm install
```

### Build

```bash
pnpm build
```

### Run CLI

```bash
# Full pipeline: extract + analyze + spec + generate
pnpm --filter @ui-extractor/cli start pipeline https://ui.shadcn.com --component button --format react

# Extract only
pnpm --filter @ui-extractor/cli start extract https://ui.shadcn.com --screenshot

# Analyze only
pnpm --filter @ui-extractor/cli start analyze https://ui.shadcn.com

# Generate from URL
pnpm --filter @ui-extractor/cli start generate https://ui.shadcn.com --component button --format react

# Learn a site for later use
pnpm --filter @ui-extractor/cli start learn https://ui.shadcn.com --save shadcn-ui

# List saved references
pnpm --filter @ui-extractor/cli start references

# Generate from saved reference
pnpm --filter @ui-extractor/cli start generate-ref shadcn-ui --format vue

# Screenshots
pnpm --filter @ui-extractor/cli start screenshot https://ui.shadcn.com --types full,viewport,sections,components

# Compare two sites
pnpm --filter @ui-extractor/cli start compare https://ui.shadcn.com https://vercel.com
```

### Run MCP Server

Add to your MCP config (Cursor, Claude Desktop, Windsurf, VS Code):

```json
{
  "mcpServers": {
    "ui-extractor": {
      "command": "node",
      "args": ["packages/mcp/src/server.js"],
      "cwd": "/path/to/ui-extractor"
    }
  }
}
```

Then in Cursor:

```
@ui-extractor uix_pipeline https://ui.shadcn.com --component button --format react
```

## Architecture

Monorepo with three packages:

- `packages/core` — Core library (extract, analyze, spec, generate, pipeline, learn)
- `packages/cli` — Command-line interface
- `packages/mcp` — MCP server for AI agent integration

Data flow: URL → Playwright extraction → Analysis (design system, components, patterns) → Spec generation → Code generation (React/Vue/HTML).

## Project Structure

- `packages/core/src/` — Core modules (extract.js, analyze.js, spec.js, generate.js, pipeline.js, index.js)
- `packages/cli/src/` — CLI entry point (index.js)
- `packages/mcp/src/` — MCP server (server.js)
- `docs/` — Documentation (agent-workflow.md, teardown-method.md, teardown-cheatsheet.md)
- `eslint-rules/` — Custom ESLint rules (unicode-policy, code-block-language)
- `eslint-processors/` — Custom ESLint processors (markdown-snippets)

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run CLI in watch mode |
| `pnpm build` | Build all packages |
| `pnpm test` | Run tests with Vitest |
| `pnpm eslint .` | Lint all files |
| `pnpm mcp` | Start MCP server |
| `pnpm cli` | Run CLI |

## Configuration

### Screenshot Types

- `full` — Full page screenshot
- `viewport` — Viewport only
- `mobile` — Mobile viewport (375px)
- `sections` — Per-section screenshots
- `components` — Per-component screenshots

```bash
pnpm --filter @ui-extractor/cli start extract https://example.com --screenshot --screenshot-types full,viewport,sections,components
```

### MCP Tools

- `uix_pipeline` — Full pipeline
- `uix_extract` — Extract UI data
- `uix_analyze` — Analyze patterns and design system
- `uix_spec` — Generate component specification
- `uix_generate` — Generate component code
- `uix_learn` — Learn and save reference
- `uix_references` — List references
- `uix_generate_from_reference` — Generate from saved reference
- `uix_compare` — Compare two URLs

## Agent Rules

Any AI agent working on this project MUST read and follow `AGENT_RULES.md` before performing any operations.

## License

MIT

---

Built with: Node.js 20 + TypeScript + Playwright + Commander.js