# Contributor Guide

This guide covers local development practices for MeetFlow.

## Development Flow

1. Create a focused branch for the change.
2. Keep changes scoped to the feature, fix, or documentation update.
3. Run the relevant checks before handing off the work.
4. Update documentation when behavior, setup, or runtime expectations change.

## Code Style

- Follow the patterns already used in the nearby module.
- Prefer small, readable functions over broad rewrites.
- Keep UI changes consistent with the existing component system.
- Add comments only when they clarify non-obvious behavior.
- Avoid touching generated output unless the generated artifact is intentionally part of the change.

## Useful Checks

Frontend build:

```bash
cd desktop-client
pnpm run build
```

Rust check:

```bash
cargo check -p meetflow
```

Rust tests:

```bash
cargo test -p meetflow
```

## Desktop Development

Run the full desktop application from `desktop-client/`:

```bash
pnpm run tauri:dev
```

Run only the frontend preview:

```bash
pnpm run dev
```

Model downloads, native recording, file import, notifications, and desktop-only commands require the Tauri runtime.

## Documentation

Update `README.md` for project-level setup and usage changes. Update `desktop-client/README.md` for desktop-client-specific setup, scripts, and runtime notes.

## License

Contributions are covered by the MIT license in `LICENSE.md`.
