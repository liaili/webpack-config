const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');//自动创建html文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//清除多余文件
// 分析输出文件打包信息，用于优化
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// 可视化大小的webpack输出文件与互动缩放树形地图
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 多进程压缩
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
// 多进程打包
const HappyPack = require('happypack');
// html文件动态进入依赖cdn
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
// 缓存文件
// var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  entry: {
    inde: './src/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    }, {
        test: /\.scss$/,
        use:["style-loader","css-loader","sass-loader"]
       // 加载时顺序从右向左 
    },
    {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
    },
    {
      test: /\.(js|jsx)$/,
      loader: 'happypack/babel-loader?id=js',
      exclude: /node_modules/
    }]
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(),//每次编译都会把dist下的文件清除，我们可以在合适的时候打开这行代码，例如我们打包的时候，开发过程中这段代码关闭比较好
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        template: 'src/index.html' //使用一个模板
    }),
    new BundleAnalyzerPlugin(),
    new HappyPack({
      id: 'js',
      // threads: 4,
      loaders: [ 'babel-loader' ]
    }),
    new HappyPack({
      id: 'styles',
      // threads: 2,
      loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
    }),
    new ParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false,
          comments: false,
        },
        compress: {
          warnings: false,
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true,
        }
      }
    }),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.min.js',
    //       global: 'react',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://cdn.bootcss.com/react-dom/15.3.1/react-dom.js',
    //       global: 'react-dom',
    //     },
    //     {
    //       module: 'moment',
    //       entry: 'https://cdn.bootcss.com/moment.js/2.22.1/moment.js',
    //       global: 'moment'
    //     }
    //   ]
    // }),
    // new HardSourceWebpackPlugin({
    //   cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
    //   configHash: function(webpackConfig) {
    //     return require('node-object-hash')({sort: false}).hash(webpackConfig);
    //   },
    //   environmentHash: {
    //     root: process.cwd(),
    //     directories: [],
    //     files: ['package-lock.json', 'yarn.lock'],
    //   },
    //   info: {
    //     mode: 'none',
    //     level: 'debug',
    //   },
    //   cachePrune: {
    //     maxAge: 2 * 24 * 60 * 60 * 1000,
    //     sizeThreshold: 50 * 1024 * 1024
    //   },
    // }),
    // 引用dll打包的文件
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dll/manifest.json')
    }),
  ]
})
