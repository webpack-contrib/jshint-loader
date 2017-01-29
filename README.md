<div align="center">
  <img
    src="http://jshint.com/res/jshint.png">
  <a href="https://github.com/webpack/webpack">
    <img width="150" height="150"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>jshint-loader</h1>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev jshint-loader jshint
```

```bash
yarn add --dev jshint-loader jshint
```

<h2 align="center">Usage</h2>

> :warning: For webpack v1, see [the README in the webpack-1 branch](https://github.com/webpack-contrib/jshint-loader/blob/webpack-1/README.md).

```js
module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/, // include .js files
				exclude: /node_modules/, // exclude any and all files in the node_modules folder,
				enforce: "pre",
				loader: "jshint-loader",
				options: {
					// any jshint option http://www.jshint.com/docs/options/
					// i. e.
					camelcase: true,

					// jshint errors are displayed by default as warnings
					// set emitErrors to true to display them as errors
					emitErrors: false,

					// jshint to not interrupt the compilation
					// if you want any file with jshint errors to fail
					// set failOnHint to true
					failOnHint: false,

					// custom reporter function
					reporter: function(errors) { }
				}
			}
		]
	}
}
```

### Custom reporter

By default, `jshint-loader` will provide a default reporter.

However, if you prefer a custom reporter, pass a function under the `reporter` key in `jshint` options. (see *usage* above)

The reporter function will be passed an array of errors/warnings produced by jshint
with the following structure:
```js
[
{
	id:        [string, usually '(error)'],
	code:      [string, error/warning code],
	reason:    [string, error/warning message],
	evidence:  [string, a piece of code that generated this error]
	line:      [number]
	character: [number]
	scope:     [string, message scope;
				usually '(main)' unless the code was eval'ed]

	[+ a few other legacy fields that you don't need to worry about.]
},
// ...
// more errors/warnings
]
```

The reporter function will be excuted with the loader context as `this`. You may emit messages using `this.emitWarning(...)` or `this.emitError(...)`. See [webpack docs on loader context](https://webpack.js.org/api/loaders/#the-loader-context).

**Note:** jshint reporters are **not compatible** with jshint-loader!
This is due to the fact that reporter input is only processed from one file; not multiple files. Error reporting in this manner differs from [tranditional reporters](http://www.jshint.com/docs/reporters/) for jshint
since the loader plugin (i.e. jshint-loader) is executed for each source file; and thus the reporter is executed for each file.

The output in webpack CLI will usually be:
```js
...

WARNING in ./path/to/file.js
<reporter output>

...
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
