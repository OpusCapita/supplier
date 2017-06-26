const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, 'static'),  // with 'webpack-dev-middleware' this value is ignored.
    filename: `bundle.js`,
    //sourceMapFilename: "bundle.js.map",
    //devtoolLineToLine: true,
    library: 'supplier',
    libraryTarget: 'umd'
  },

  //exclude empty dependencies, require for Joi
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },

  devtool: 'eval-source-map',

  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|de|ru|fi|sv/),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  resolve: {
    modules: [process.env.NODE_PATH, 'node_modules'],
    extensions: ['.json', '.jsx', '.js']
  },

  resolveLoader: {
    modules: [process.env.NODE_PATH, 'node_modules'],
    extensions: ['.js']
  },

  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src')
        ],
        options: {
          presets: [
            ['es2015', {modules: false}],
            'react',
            'stage-0'
          ],
          plugins: ['transform-decorators-legacy']
        }
      }
    ]
  }
};
