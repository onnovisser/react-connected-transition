const webpack = require('webpack');
const path = require('path');

const USE_PREACT = false;
const ENV = process.env.NODE_ENV || 'production';
const PROD = ENV === 'production';
const PORT = process.env.PORT || 3000;
const PATHS = {
  entries: {
    '0-basic': path.join(__dirname, 'src/0-basic/index.jsx'),
    '1-router': path.join(__dirname, 'src/1-router/index.jsx'),
    '2-router-and-transitiongroup': path.join(
      __dirname,
      'src/2-router-and-transitiongroup/index.jsx'
    ),
  },
  context: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
};

const config = {
  entry: PATHS.entries,
  output: {
    path: PATHS.build,
    publicPath: '',
    filename: '[name]/bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-connected-transition': path.resolve(__dirname, '..'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /.*/,
        loader: `file-loader?name=[path][name].[ext]&context=${PATHS.context}`,
        exclude: /\.(jsx?)$/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV),
      },
    }),
  ],
};

if (USE_PREACT) {
  Object.assign(config.resolve.alias, {
    react: 'preact-compat',
    'react-dom': 'preact-compat',
  });
}

if (PROD) {
  Object.assign(config, {
    plugins: config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        output: {
          comments: false,
        },
        mangle: {
          screw_ie8: true,
        },
        compressor: {
          screw_ie8: true,
          warnings: false,
        },
      }),
    ]),
  });
} else {
  Object.assign(config, {
    devtool: 'cheap-module-source-map',
    plugins: config.plugins.concat([new webpack.NoEmitOnErrorsPlugin()]),
    entry: Object.keys(PATHS.entries).reduce((result, key) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = [
        `webpack-dev-server/client?http://0.0.0.0:${PORT}`,
        'webpack/hot/only-dev-server',
        PATHS.entries[key],
      ];
      return result;
    }, {}),
  });
}

module.exports = config;
