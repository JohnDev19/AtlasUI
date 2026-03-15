# Contributing to AtlasUI

Thanks for wanting to contribute! AtlasUI is a personal open-source project
by [JohnDev19](https://github.com/JohnDev19) and contributions are genuinely
welcome — bug fixes, new components, docs improvements, whatever you've got.

## Development setup

```bash
git clone https://github.com/JohnDev19/AtlasUI.git
cd AtlasUI
npm install
npm run build
```

## Repo structure

- `packages/core` — the `@atlasui/core` npm package (all 90 components live here)
- `cli` — the `@atlasui/cli` npm package

## Adding a new component

1. Create the component file inside the right category under `src/components/`
2. Re-export it from that category's `index.tsx`
3. Add the named export to `packages/core/src/index.ts`
4. Register it in `cli/src/registry.ts` with its deps and category
5. Export TypeScript types properly

## Code standards

- TypeScript strict mode — no `any` unless truly necessary
- All components must use `React.forwardRef`
- ARIA attributes on every interactive element — test with a screen reader if you can
- Support `asChild` via Radix `Slot` for composable use cases
- No hardcoded colors — everything goes through CSS custom properties
- Use `cn()` from `utils/cn.ts` for class merging, never string concatenation

## Commit style

```
feat: add <ComponentName>
fix: <ComponentName> keyboard focus not trapped
docs: add usage example for <ComponentName>
chore: bump @radix-ui/* to latest
```

## Pull requests

1. Fork the repo
2. Branch off `main`: `git checkout -b feat/my-component`
3. Open a PR — fill in the template and describe what you changed

**Issues/questions:** https://github.com/JohnDev19/AtlasUI/issues

## License

By submitting a PR you agree your contribution will be licensed under MIT.
