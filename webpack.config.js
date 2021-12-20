const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist',
    filename: 'vue-split-layout.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json', '.jsx']
  },
  performance: {
    hints: false
  },
  plugins: [new VueLoaderPlugin()],
  devtool: 'source-map'
}

if (process.env.NODE_ENV === 'development') {
  module.exports = merge(common, {
    mode: 'development',
    entry: './demo/main.js',
    output: {
      path: path.resolve(__dirname, './docs'),
      publicPath: '/vue-split-layout/',
      filename: 'index.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'demo/index.html'
      })
    ],
    devServer: {
      historyApiFallback: true,
      static: path.join(__dirname, './demo/dist')
    }
  })
}

if (process.env.NODE_ENV === 'production') {
  module.exports = merge(common, {
    mode: 'production',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ],
    externals: { vue: 'vue' }
  })
}
