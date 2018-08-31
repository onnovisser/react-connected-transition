import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';

const ENV = process.env.NODE_ENV || 'development';

export default [
  {
    // Builds for bundlers (CommonJS, ES module)
    input: 'src/index.js',
    external: ['react'],
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(ENV),
      }),
    ],
    output: [
      {
        globals: {
          react: 'React',
        },
        file: pkg.main,
        format: 'cjs',
        exports: 'default',
      },
      {
        globals: {
          react: 'React',
        },
        file: pkg.module,
        format: 'es',
        exports: 'default',
      },
    ],
  },
  {
    // browser-friendly UMD build
    input: 'src/index.js',
    external: ['react'],
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
    output: {
      globals: {
        react: 'React',
      },
      file: pkg['umd:main'],
      format: 'umd',
      exports: 'default',
    },
    moduleName: 'ReactConnectedTransition',
  },
];
