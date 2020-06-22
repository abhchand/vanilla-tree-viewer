var path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');


var DEMO_SRC_DIR = path.resolve(__dirname, 'demo', 'src');
var DEMO_BUILD_DIR = path.resolve(__dirname, 'demo', 'build');
var DIST_DIR = path.resolve(__dirname, 'dist');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js', '.sass', '.scss', '.css'],
    modules: [
      SRC_DIR,
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: ['node_modules']
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: process.env.NODE_ENV == 'development' },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: process.env.NODE_ENV == 'development' },
          },
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};


// We build 2 outputs -
//
//    1. A compiled demo for Github Pages. Also serves
//       as a convenient preview for local development
//       Input:  DEMO_SRC_DIR
//       Output: DEMO_BUILD_DIR
//
//    2. A distribution for production / npm package
//       Input:  SRC_DIR
//       Output: DIST_DIR
//


//
// DEMO (AND DEVELOPMENT PREVIEW)
//

var demoConfig = Object.assign({}, config, {
  entry: DEMO_SRC_DIR + '/index.js',
  output: {
    path: DEMO_BUILD_DIR,
    filename: 'index.js'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: DEMO_SRC_DIR + '/template.html'
    })
  ]
});

if (config.mode == 'development') {

  demoConfig.devServer = {
    contentBase: DEMO_SRC_DIR + '/index',
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: 'localhost',
    hot: true,
    overlay: true,
    port: 3035,
    quiet: false,
    stats: {
      errorDetails: true
    },
    useLocalIp: false,
    watchOptions: {
      ignored: '/node_modules/'
    }
  }

  demoConfig.output.publicPath = '/';
}

//
// PRODUCTION DISTRIBUTION
//

var distConfig = Object.assign({}, config, {
  entry: SRC_DIR + '/components/VanillaTreeViewer/VanillaTreeViewer.js',
  output: {
    path: DIST_DIR,
    filename: 'index.js',
    library: 'VanillaTreeViewer',
    libraryTarget: 'var'
  },
  externals: {},
  plugins: [
    new MiniCssExtractPlugin()
  ],
  devtool: 'source-map'
});

module.exports = [
  // Order matters! From the docs:
  //
  //  > When exporting multiple configurations only the `devServer`
  //  > options for the first configuration will be taken into
  //  > account and used for all the configurations in the array.
  //
  demoConfig,
  distConfig
];
