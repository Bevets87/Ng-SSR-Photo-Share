const path = require('path');
const webpack = require('webpack');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.join(process.cwd(), 'scripts', 'seed-database.ts'),
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node',
  mode: 'production',
  externals: [webpackNodeExternals()],
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: 'seed-database.js',
    libraryTarget: 'commonjs'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ]

}
