// Build script: bundle lunar-javascript into a single ESM file for browser
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['node_modules/lunar-javascript/index.js'],
  bundle: true,
  outfile: 'public/lunar-bundle.js',
  format: 'esm',
  target: 'es2020',
  platform: 'browser',
  globalName: 'Lunar',
  minify: true,
  sourcemap: true,
}).catch(() => process.exit(1));