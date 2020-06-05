import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from '../package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];
export default {
  input: 'src/serviceWorker/sw.ts',
  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),
    // Compile TypeScript/JavaScript files
    babel({
      babelHelpers: 'bundled',
      extensions,
      include: ['src/**/*'],
    }),
  ],
  output: [{
    file: `dist/sw.${pkg.version}.iife.js`,
    format: 'iife',
    name: 'serviceWorkerCache',
    globals: {},
  }],
};