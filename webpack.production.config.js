const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/client/index.js'
  },
  output: {
    path: path.resolve(__dirname, './src/server/static'),
    publicPath: '/static',
    filename: `bundle.js`,
    library: 'supplier',
    libraryTarget: 'umd',
    umdNamedDefine: true
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

  bail: true,
  // devtool: 'source-map',

  plugins: [
    new webpack.ContextReplacementPlugin(
      new RegExp('\\' + path.sep + 'node_modules\\' + path.sep + 'moment\\' + path.sep + 'locale'),
      /en|de/
    ),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,  // TODO: del if sourceMap is removed with devtool
      compressor: {
        // don't show unreachable variables etc
        warnings: false,
        // drop_console: true,  // TODO: uncomment
        unsafe: true,
        pure_getters: true,
        dead_code: true,
        unsafe_comps: true,
        screw_ie8: true
      }
    })
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
