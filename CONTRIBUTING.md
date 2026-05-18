# Contributing to Devicebase JS SDK

Thank you for contributing to the Devicebase JavaScript SDK.

This document explains the local development, testing, and contribution workflow. Please keep changes small and focused, and include the necessary tests.

## Development Environment

- Node.js: >= 18 (recommended: use `.nvmrc` in this repository, currently v22)
- Package manager: pnpm (this project uses `pnpm@11.1.2`)

Recommended setup steps:

```bash
nvm use
corepack enable
pnpm install
```

## Project Structure

- `src/`: SDK source code
- `tests/`: unit tests (Vitest)
- `examples/`: example scripts
- `.github/workflows/`: release and automation workflows

## Common Commands

```bash
# Run the example
pnpm dev

# Build outputs (Vite bundle + d.ts generation)
pnpm build

# Unit tests
pnpm test

# Test watch mode
pnpm test:watch

# TypeScript type checking
pnpm typecheck

# ESLint check
pnpm lint
```

Before submitting, it is recommended to run at least:

```bash
pnpm lint && pnpm typecheck && pnpm test
```

## Code Style

- Use TypeScript and keep code compatible with `strict` mode.
- Keep changes as small and single-purpose as possible. Avoid unrelated refactoring.
- Add tests for new behavior. For bug fixes, prioritize adding a test that reproduces the issue.
- If public APIs change, update examples or documentation in `README.md` accordingly.

Linting is based on `@antfu/eslint-config`. Use `pnpm lint` as the source of truth.

## Testing Conventions

- The test framework is Vitest, and test files are located in `tests/*.test.ts`.
- Use clear behavior-oriented test names, for example:
  - `it('tap sends coordinates', ...)`
  - `it('throws AuthenticationError without API key', ...)`
- For network-related behavior, use mocks (such as `vi.fn()`) to keep tests stable and reproducible.

## Branching and Commits

Use feature branches for development. Do not commit directly to `main`:

```bash
git checkout -b feat/short-description
```

Commit message format is not strictly enforced at the moment, but Conventional Commits are recommended for release and changelog management, for example:

- `feat: add minitouch reconnect support`
- `fix: handle empty screenshot response`
- `docs: improve websocket usage example`

## Pull Request Guidelines

Please include the following in your PR:

- Purpose and background of the change
- Main changes
- Testing notes (what tests were added/updated, or why tests are not needed)
- If there are breaking changes, clearly describe the migration path

Suggested self-checklist:

- [ ] Code passes `pnpm lint`
- [ ] Type checking passes `pnpm typecheck`
- [ ] Tests pass `pnpm test`
- [ ] Documentation (such as `README.md`) is updated accordingly

## Release

This repository is configured with the following release flow:

- Pushing a tag (`v*.*.*`) triggers the release workflow and generates a draft of release notes
- Publishing a GitHub Release triggers the npm publish workflow

For local releases, you can use `npm version` to create a version bump and git tag, for example:

```bash
# Bump patch version (for example, 1.2.3 -> 1.2.4)
npm version patch

# Or bump minor / major as needed
npm version minor
npm version major
```

Running `npm version` will trigger the `version` script in `package.json`.

## Security and Configuration

- Do not commit any secrets or sensitive information.
- For local debugging, you can use environment variables (for example, `API_KEY` and `SERIAL`).

Thanks again for your contribution.
