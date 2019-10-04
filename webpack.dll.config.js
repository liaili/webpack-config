const path = require("path");
const webpack = require("webpack");
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer')

const vendor = [
  "react",
  "react-dom",
  "react-router-dom",
  "jquery",
  "js-md5",
  "moment",
  "react-router",
  "react-weui",
  "weui",
  "redux",
  "immutable",
];

const dllPath = path.join(__dirname, 'dll');

module.exports = {
  entry: {
    dll: vendor
  },
  output: {
    path: dllPath,
    filename: "[name].js",
    library: "_dll_[name]"
  },
  plugins: [
		new webpack.DllPlugin({
	    name: "_dll_[name]",
			path: path.join(__dirname, 'dll','manifest.json'),
	  }),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static'
		}),
	]
}