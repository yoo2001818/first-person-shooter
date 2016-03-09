var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './src/client.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    chunkFilename: '[id].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'first-person-shooter'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/i,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      {
        test: /\.json$/i,
        loader: 'json'
      },
      {
        test: /\.html?$/i,
        loader: 'html'
      },
      /*
      {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract('style', 'css!import-glob')
      },
      {
        test: /\.s[ca]ss$/i,
        loader: ExtractTextPlugin.extract('style', 'css!sass!import-glob')
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
        loader: 'url-loader?limit=10240'
      },*/
      {
        test: /\.(png|jpe?g|gif|tiff)?$/,
        loader: 'file-loader'
      }
    ]
  },
  node: {
    fs: 'empty'
  },
};
