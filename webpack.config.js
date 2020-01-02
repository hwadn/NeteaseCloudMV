const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	mode: "development",
	entry: {
		home: './src/main.js'
	},
	output: {
		filename: "bundle.js",
		// 打包放置资源的路径
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/', // 服务器根目录
	},
	plugins: [
		// 更新文件
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: "./public/index.html", // 以此为模板更新
		}),
		// 删除旧文件
		// new CleanWebpackPlugin(),
		// 热替换
		// new webpack.NamedModulesPlugin(),
		// new webpack.HotModuleReplacementPlugin(),
		// vue
		new VueLoaderPlugin()
	],
	// 跟踪错误
	devtool: 'inline-source-map',
	// 告诉开发服务器在哪里查找文件。输出的文件只存在于内存中
	devServer: {
		contentBase: './dist', // 默认output.path
		// publicPath: '/' // 默认output.publicPath
		// hot: true,
		compress: true, // gzip压缩
		overlay: true,
		host:'0.0.0.0',
		historyApiFallback: true,
	},
	resolve: {
		// 路径映射。需要编译器
		alias: {
			// 'vue$': 'vue/dist/vue.esm.js'
		}
	},
	module: {
		rules:[
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif|jpeg)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(woff|svg|eot|ttf)$/,
				loader: 'url-loader'
			},
			{
				test: /\.vue$/,
				use: [
					'vue-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					},
					// {
					// 	loader: 'eslint-loader'
					// }
				]
			}
		]
	}
}