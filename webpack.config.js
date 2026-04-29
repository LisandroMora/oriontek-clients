const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/[name].js',
      publicPath: '/',
      clean: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],

    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    devServer: {
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
    },
  };
};