var RcLoader = require("rcloader");
var stripJsonComments = require("strip-json-comments");
var path = require("path");
var shjs = require("shelljs");
var _ = require("lodash");

// setup RcLoader
var rcLoader = new RcLoader(".jshintrc", null, {
  loader: function(path) {
    return path;
  }
});

function loadRcConfig(callback){
  var sync = typeof callback !== "function";

  if(sync){
    var fp = rcLoader.for(this.resourcePath);
    if(typeof fp !== "string") {
      // no .jshintrc found
      return {};
    } else {
      this.addDependency(fp);
      var options = loadConfig(fp);
      delete options.dirname;
      return options;
    }
  }
  else {
    rcLoader.for(this.resourcePath, function(err, fp) {
      if(typeof fp !== "string") {
        // no .jshintrc found
        return callback(null, {});
      }

      this.addDependency(fp);
      var options = loadConfig(fp);
      delete options.dirname;
      callback(err, options);
    }.bind(this));
  }
}

function loadConfig(fp) {
  if (!fp) {
    return {};
  }

  if (!shjs.test("-e", fp)) {
    throw new Error("Can't find config file: " + fp);
  }

  try {
    var config = JSON.parse(stripJsonComments(shjs.cat(fp)));
    config.dirname = path.dirname(fp);

    if (config["extends"]) {
      var baseConfig = loadConfig(path.resolve(config.dirname, config["extends"]));
      config = _.merge({}, baseConfig, config, function(a, b) {
        if (_.isArray(a)) {
          return a.concat(b);
        }
      });
      delete config["extends"];
    }

    return config;
  } catch (err) {
    throw new Error("Can't parse config file: " + fp + "\nError:" + err);
  }
}

module.exports = loadRcConfig;
