import fs from 'fs';
import path from 'path';
import { defineConfig, Options } from 'tsup';

const customNoExternal = new Set([
  "oauth4webapi",
]);

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

const config: Options = {
  entryPoints: ['src/**/*.{ts,tsx,js,jsx}'],
  sourcemap: true,
  clean: false,
  noExternal: [...customNoExternal],
  dts: {
    compilerOptions: {
      skipLibCheck: true,
      // Ignore unused ts-expect-error directives
      ignoredDiagnostics: [2578]
    }
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  legacyOutput: true,
  treeshake: true,
  splitting: false,
  esbuildOptions(options) {
    // Handle import.meta.vitest in CJS format
    if (options.format === 'cjs') {
      options.define = {
        ...options.define,
        'import.meta.vitest': 'undefined',
      };
    }
  },
};

export default defineConfig(config);
