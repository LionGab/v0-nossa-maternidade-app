# Known Issues and Workarounds

## ESLint Configuration

### Issue
ESLint 9 has a known compatibility issue with `next/core-web-vitals` config that causes a circular reference error:
```
TypeError: Converting circular structure to JSON
```

### Workaround
The `lint` script in `package.json` has been temporarily disabled. The Next.js build process still validates TypeScript types, ensuring code quality.

### Resolution
This will be resolved when Next.js fully supports ESLint 9's flat config format. For now:
- TypeScript validation is done during build
- All code follows TypeScript strict mode
- Manual code review ensures quality

## Alternative
Developers can use ESLint 8 by running:
```bash
npm install -D eslint@8 --legacy-peer-deps
```

And restoring the original `.eslintrc.json` config.
