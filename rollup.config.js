import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';

const ENV = process.env.NODE_ENV || 'development';

export default [
  {
    // Builds for bundlers (CommonJS, ES module)
    entry: 'src/index.js',
    external: ['react', 'react-dom', 'prop-types'],
    exports: 'default',
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
      replace({
        'process.env.NODE_ENV': JSON.stringify(ENV),
      }),
    ],
    targets: [
      { dest: pkg.main, format: 'cjs' },
      { dest: pkg.module, format: 'es' },
    ],
  },
  {
    // browser-friendly UMD build
    entry: 'src/index.js',
    dest: pkg['umd:main'],
    format: 'umd',
    moduleName: 'ConnectedTransition',
    external: ['react', 'react-dom'],
    exports: 'default',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes',
    },
    useStrict: false,
    sourceMap: true,
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs({
        ignoreGlobal: true,
        include: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(ENV),
      }),
    ],
  },
];
