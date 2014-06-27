# jshint loader for webpack

## Usage

Apply the jshint loader as preloader.

``` javascript
preLoaders: [
	{
		test: /\.jsx$/, // include .js files
		exclude: /node_modules/, // exclude any and all files in the node_modules folder
		loader: "jshint"
	}
],
// more options in the optional jshint object
jshint: {
	// any jshint option http://www.jshint.com/docs/
	// i. e.
	camelcase: true,

	// jshint errors are displayed by default as warnings
	// set emitErrors to true to display they as errors
	emitErrors: false,
	
	// jshint to not interrupt the compilation
	// if you want any file with jshint errors to fail
	// set failOnHint to true
	failOnHint: false
}
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
