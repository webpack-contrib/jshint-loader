"use strict";

module.exports = {
	output: {
		path: __dirname + "/trash/",
		filename: "bundle.js"
	},
	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loader: "./index",
				exclude: /node_modules/
			}
		]
	}
};
