const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    registration: './src/client/components/SupplierRegistrationEditor/index.js',
    information: './src/client/components/SupplierEditor/index.js',
    address: './src/client/components/SupplierAddressEditor/index.js',
    contact: './src/client/components/SupplierContactEditor/index.js',
    profile_strength: './src/client/components/SupplierProfileStrength/index.js',
    bank_accounts: './src/client/components/SupplierBankAccountEditor/index.js',
    directory: './src/client/components/SupplierSearch/index.js',
    access_approval: './src/client/components/SupplierApproval/index.js',
    autocomplete: './src/client/components/SupplierAutocomplete/index.js',
    list: './src/client/components/SupplierList/index.js',
    organization: './src/client/components/SupplierOrganization/index.js',
    creation: './src/client/components/SupplierCreator/index.js',
    visibility: './src/client/components/SupplierVisibilityPreference/index.js',
  },
  output: {
    path: path.resolve(__dirname, './src/server/static'),
    publicPath: '/static',
    filename: 'components/[name]-bundle.js',
    library: 'supplier-[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  //exclude empty dependencies, require for Joi
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },

  bail: true,
  // devtool: 'source-map',

  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|de/),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  resolve: {
    extensions: ['.json', '.jsx', '.js']
  },

  resolveLoader: {
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
        test: /.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src')
        ],
        options: {
          compact: true,
          presets: [
            ['env', {'targets': {'node': 8, 'uglify': true}, 'modules': false}],
            'react',
            'stage-0'
          ],
          plugins: ['transform-decorators-legacy']
        }
      }
    ]
  }
};
