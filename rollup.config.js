import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');

export default {
  entry: 'src/index.js',
  external: ['react', 'react-dom', 'prop-types'],
  exports: 'named',
  globals: {
    react: 'React',
    'react-dom': 'ReactDom',
    'prop-types': 'PropTypes',
  },
  useStrict: false,
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolve({
      jsnext: false,
      main: true,
      browser: true,
    }),
    commonjs({
      ignoreGlobal: true,
      include: 'node_modules/**',
    }),
  ],
  targets: [
    { dest: pkg.main, format: 'cjs' },
    { dest: pkg.module, format: 'es' },
    { dest: pkg['umd:main'], format: 'umd', moduleName: pkg.name },
  ],
};
