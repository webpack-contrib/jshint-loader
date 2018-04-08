const path = require('path');

const RcLoader = require('rcloader');
const stripJsonComments = require('strip-json-comments');

const shjs = require('shelljs');
const _ = require('lodash');

// setup RcLoader
const rcLoader = new RcLoader('.jshintrc', null, {
  loader(path) {
    return path;
  },
});

// eslint-disable-next-line consistent-return
function loadRcConfig(callback) {
  const sync = typeof callback !== 'function';

  if (sync) {
    const fp = rcLoader.for(this.resourcePath);
    if (typeof fp !== 'string') {
      // no .jshintrc found
      return {};
    }
    this.addDependency(fp);
    const options = loadConfig(fp);
    delete options.dirname;
    return options;
  }

  // eslint-disable-next-line consistent-return
  rcLoader.for(this.resourcePath, (err, fp) => {
    if (typeof fp !== 'string') {
      // no .jshintrc found
      return callback(null, {});
    }

    this.addDependency(fp);
    const options = loadConfig(fp);
    delete options.dirname;
    callback(err, options);
  });
}

function loadConfig(fp) {
  if (!fp) {
    return {};
  }

  if (!shjs.test('-e', fp)) {
    throw new Error(`Can't find config file: ${fp}`);
  }

  try {
    let config = JSON.parse(stripJsonComments(shjs.cat(fp)));
    config.dirname = path.dirname(fp);

    if (config.extends) {
      const baseConfig = loadConfig(
        path.resolve(config.dirname, config.extends)
      );
      // eslint-disable-next-line consistent-return
      config = _.merge({}, baseConfig, config, (a, b) => {
        if (_.isArray(a)) {
          return a.concat(b);
        }
      });
      delete config.extends;
    }

    return config;
  } catch (err) {
    throw new Error(`Can't parse config file: ${fp}\nError:${err}`);
  }
}

module.exports = loadRcConfig;
