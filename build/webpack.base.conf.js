const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
const HappyPack = require('happypack')
const os = require('os')
const vueLoaderConfig = require('./vue-loader.conf')
const {version} = require('../package')
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config')

const isProd = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function subPath (_path) {
  return path.posix.join(config[process.env.BUILD_ENV].SUB_DIR, _path)
}

const webpackConfig = {
  target: 'web',
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? '' : 'source-map',
  entry: {
    index: resolve('src/app.js')
  },
  output: {
    filename: subPath('js/[name].[hash:8].js'),
    path: resolve(`dist`),
    publicPath: config[process.env.BUILD_ENV].PUBLIC_PATH
  },
  externals: {
    vue: 'Vue',
    'element-ui': 'ELEMENT'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      src: resolve('src'),
      assets: resolve('src/assets'),
      components: resolve('src/components'),
      store: resolve('src/store')
    }
  },
  module: {
    rules: [
      {
        test: /\.(vue|js|jsx)$/,
        loader: 'eslint-loader',
        include: resolve('src'),
        exclude: [resolve('node_modules'), resolve('src/static'), resolve('local')],
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: resolve('src'),
        options: vueLoaderConfig
      },
      {
        test: /\.js[x]?$/,
        loader: 'happypack/loader?id=happy-babel-js',
        include: resolve('src')
      },
      {
        test: /.(png|jpg|gif|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: subPath('img/[name].[hash:7].[ext]'),
              limit: 5000 // 单位是byte
            }
          }
        ],
        include: resolve('src')
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              name: subPath('media/[name].[hash:7].[ext]')
            }
          }
        ],
        include: resolve('src')
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              name: subPath('fonts/[name].[hash:7].[ext]')
            }
          }
        ],
        include: resolve('src')
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'async',
          minChunks: 2,
          minSize: 0
        },
        vender: {
          name: 'vendor',
          test: resolve('node_modules'),
          chunks: 'all',
          priority: 10
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    }),
    new VueLoaderPlugin(),
    new HappyPack({
      id: 'happy-babel-js',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      minify: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        MOCK: JSON.stringify(config[process.env.BUILD_ENV].MOCK),
        BUILD_ENV: JSON.stringify(config[process.env.BUILD_ENV].BUILD_ENV),
        NODE_ENV: JSON.stringify(config[process.env.BUILD_ENV].NODE_ENV),
        API_PATH: JSON.stringify(config[process.env.BUILD_ENV].API_PATH),
        SUB_DIR: JSON.stringify(config[process.env.BUILD_ENV].SUB_DIR),
        PUBLIC_PATH: JSON.stringify(config[process.env.BUILD_ENV].PUBLIC_PATH),
        PC_HOST: JSON.stringify(config[process.env.BUILD_ENV].PC_HOST),
        MOBILE_HOST: JSON.stringify(config[process.env.BUILD_ENV].MOBILE_HOST),
        SAASROUTE: JSON.stringify(config[process.env.BUILD_ENV].SAASROUTE)
      }
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('src/static'),
        to: resolve(`dist/${config[process.env.BUILD_ENV].SUB_DIR}`),
        ignore: ['.*']
      }
    ])
  ]
}

module.exports = webpackConfig
