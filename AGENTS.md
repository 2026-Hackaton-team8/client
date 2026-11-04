<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Rules

Next.js (App Router) + React 19 + Tailwind CSS v4, structured with Feature-Sliced Design.

## 1. Ask when unclear

If a requirement, design, naming, or placement is ambiguous, interview the user before writing code. Ask short, concrete questions with options and a recommended default. Do not guess and build on top of a guess.

## 2. Feature-Sliced Design

All application code lives in `src/`, split into layers. A layer may import only from layers below it.

```
src/
  app/       # providers, global styles (globals.css)
  pages/     # page compositions (one slice per route)
  widgets/   # large self-contained UI blocks
  features/  # user interactions that bring business value
  entities/  # business entities (model, api, ui)
  shared/    # ui kit, lib, api client, config — no business logic
```

- Import direction: `app → pages → widgets → features → entities → shared`. Never import upward or sideways between slices of the same layer.
- Each slice exposes a public API through `index.ts`. Import a slice only through it (`@/widgets/unity-player`, not `@/widgets/unity-player/ui/UnityPlayer`).
- Segments inside a slice: `ui/`, `model/`, `api/`, `lib/`, `config/`. Create only what is needed.
- Use the `@/*` alias (maps to `src/*`). No deep relative paths across slices.
- Root `app/` holds Next.js routing files only. Keep `page.tsx` / `layout.tsx` thin and render compositions from `src/pages`.
- Root `pages/` must stay empty (it only stops Next.js from treating `src/pages` as the Pages Router).

## 3. Components

- Function components with named exports. One component per file, file name in PascalCase (`UserCard.tsx`).
- Reusable, domain-agnostic UI goes in `src/shared/ui`. Check there before creating a new primitive.
- Type props with a `Props` type next to the component. No `any`.
- Server Components by default. Add `"use client"` only to components that need state, effects, or browser APIs, and keep that boundary as low in the tree as possible.
- Style with Tailwind classes. No inline `style` unless the value is dynamic at runtime.

## 4. Design tokens

Tokens are defined in `src/app/styles/globals.css` under `@theme`. Always use them.

- Colors: `primary-50` … `primary-600`, `secondary-50` … `secondary-900` (e.g. `bg-primary-500`, `text-secondary-900`, `border-secondary-300`).
- Typography (size + weight + line height in one class): `text-display-xl`, `text-heading-xl|lg|md|sm`, `text-title-lg|md`, `text-body-lg|md|sm`, `text-label-lg|md`, `text-caption`.
- Font: Pretendard is the default `font-sans`.
- Do not use raw hex values or arbitrary values (`bg-[#5A77B3]`, `text-[13px]`). If a needed value has no token, ask before adding one to `@theme`.

## 5. Git

- Branch from `main` as `type/short-description` (e.g. `feat/design-token`, `fix/login-error`) and merge back through a PR.
- Commit message format: `type :: 한글 설명` (e.g. `feat :: 로그인 페이지 추가`).
- Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `test`.
- Commits and PRs must read as written by a team member. Never add `Co-Authored-By` trailers, "Generated with …" lines, AI tool mentions, or emoji.
- Fill in `.github/pull_request_template.md` when opening a PR.

## 6. Before finishing

Run and pass:

```bash
npm run lint
npx tsc --noEmit
npx prettier --check .
```
