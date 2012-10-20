# jshint loader for webpack

## Usage

Apply the jshint loader as preloader.

``` javascript
preLoaders: [
	{
		test: "\\.js$", // include .js files
		exclude: "node_modules", // exclude any file in a node_modules folder
		// exclude: ["(node|web)_modules", "jam"], // exclude more files
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
	// set failOnError to true
	failOnError: false
}
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)