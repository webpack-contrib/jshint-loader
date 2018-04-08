/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/* eslint guard-for-in: off, no-param-reassign: off */
const jshint = require('jshint').JSHINT;
const loaderUtils = require('loader-utils');

const loadRcConfig = require('./loadRcConfig');

function jsHint(input, options) {
  // copy options to own object
  // if (this.options.jshint) {
  //   for (const name in this.options.jshint) {
  //     options[name] = this.options.jshint[name];
  //   }
  // }

  // copy query into options
  // const query = loaderUtils.getOptions(this) || {};
  // for (const name in query) {
  //   options[name] = query[name];
  // }

  // copy globals from options
  const globals = {};
  if (options.globals) {
    if (Array.isArray(options.globals)) {
      options.globals.forEach((g) => {
        globals[g] = true;
      }, this);
    } else {
      for (const g in options.globals) {
        globals[g] = options.globals[g];
      }
    }
    delete options.globals;
  }

  // console.log('options', options);

  // move flags
  const { emitErrors, failOnHint, reporter } = options;
  delete options.emitErrors;
  delete options.failOnHint;
  delete options.reporter;

  // module system globals
  globals.require = true;
  globals.module = true;
  globals.exports = true;
  globals.global = true;
  globals.process = true;
  globals.define = true;

  const source = input.split(/\r\n?|\n/g);
  const result = jshint(source, options, globals);
  const { errors } = jshint;

  if (!result) {
    if (reporter) {
      reporter.call(this, errors);
    } else {
      const hints = [];
      if (errors) {
        errors.forEach((error) => {
          if (!error) return;
          const message = `  ${error.reason} @ line ${error.line} char ${
            error.character
          }\n    ${error.evidence}`;
          hints.push(message);
        }, this);
      }
      const message = hints.join('\n\n');
      const emitter = emitErrors ? this.emitError : this.emitWarning;
      if (emitter) {
        emitter(`jshint results in errors\n${message}`);
      } else {
        throw new Error(
          `Your module system doesn't support emitWarning. Update availible? \n${message}`
        );
      }
    }
  }
  if (failOnHint && !result) {
    throw new Error(
      'jshint-loader: Module Build Failed due to a jshint error.'
    );
  }
}

// eslint-disable-next-line consistent-return
module.exports = function loader(input, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();

  if (!callback) {
    // load .jshintrc synchronously
    const config = loadRcConfig.call(this);
    const options = Object.assign({}, config, loaderUtils.getOptions(this));
    jsHint.call(this, input, options);
    return input;
  }

  // load .jshintrc asynchronously
  // eslint-disable-next-line consistent-return
  loadRcConfig.call(this, (err, config) => {
    if (err) {
      return callback(err);
    }

    try {
      const options = Object.assign({}, config, loaderUtils.getOptions(this));
      jsHint.call(this, input, options);
    } catch (e) {
      return callback(e);
    }
    callback(null, input, map);
  });
};
