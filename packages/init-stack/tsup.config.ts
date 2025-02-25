import fs from 'fs';
import path from 'path';
import { defineConfig, Options } from 'tsup';

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

const config: Options = {
  entryPoints: ['src/index.ts'],
  sourcemap: true,
  clean: false,
  dts: true,
  outDir: 'dist',
  format: ['esm'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  esbuildPlugins: [
    {
      name: 'stackframe init-stack tsup plugin',
      setup(build) {
        build.onLoad({ filter: /\.(jsx?|tsx?)$/ }, async (args) => {
          let contents = await fs.promises.readFile(args.path, 'utf8');
          contents = contents.replace(/STACK_COMPILE_TIME_CLIENT_PACKAGE_VERSION_SENTINEL/g, `init-stack ${packageJson.name}@${packageJson.version}`);
          return {
            contents,
            loader: path.extname(args.path).slice(1) as 'js' | 'jsx' | 'ts' | 'tsx'
          };
        });
      },
    },
  ],
};

export default defineConfig(config);
