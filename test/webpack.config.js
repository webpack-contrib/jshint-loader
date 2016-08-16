"use strict";

module.exports = {
	output: {
		path: __dirname + "/trash/",
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "./index",
				exclude: /node_modules/
			}
		]
	}
};
