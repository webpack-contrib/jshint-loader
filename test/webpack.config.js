"use strict";

module.exports = {
	output: {
		path: __dirname + "/trash/",
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "./index",
				enforce: "pre",
				exclude: /node_modules/
			}
		]
	}
};
