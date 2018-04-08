const path = require('path');

const webpack = require('webpack');

const loadRcConfig = require('../lib/loadRcConfig');

const config = require('./webpack.config');

describe('jshint loader', () => {
  let conf = {};

  beforeEach(() => {
    conf = Object.assign({}, config, {
      entry: './test/fixtures/default.js',
    });

    conf.module.rules = [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: path.resolve(`${__dirname}/../lib/index`),
          options: {},
        },
      },
    ];
  });

  test('should find and coalesce nested .jshintrc files', () => {
    const host = {
      resourcePath: conf.entry,
      addDependency() {},
    };
    expect(loadRcConfig.call(host)).toEqual({
      bitwise: true,
      expr: true,
      shadow: true,
      mocha: true,
      node: true,
      quotmark: 'double',
    });
  });

  test('should respect & overwrite lint options in webpack config', (done) => {
    conf.module.rules[0].use.options.asi = true;

    webpack(conf, (err, stats) => {
      expect(stats.hasWarnings()).toBeFalsy();
      expect(stats.hasErrors()).toBeFalsy();
      done();
    });
  });

  test('should emit errors when emitErrors is enabled', (done) => {
    conf.entry = './test/fixtures/failure.js';
    conf.module.rules[0].use.options.emitErrors = true;

    webpack(conf, (err, stats) => {
      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();

      expect(hasErrors).toBeTruthy();
      expect(hasWarnings).toBeFalsy();
      done();
    });
  });

  test('should stop compilation when failOnHint is enabled', (done) => {
    conf.bail = true;
    conf.entry = './test/fixtures/failure.js';
    conf.module.rules[0].use.options = {
      emitErrors: true,
      failOnHint: true,
    };

    webpack(conf, (err, stats) => {
      expect(stats.hasErrors()).toBeTruthy();
      done();
    });
  });

  // TODO: Write tests for context and arguments
  describe('custom transform', () => {
    let mockReporter;

    beforeEach(() => {
      mockReporter = jest.fn();
      conf.entry = './test/fixtures/failure.js';
      conf.module.rules[0].use.options.reporter = mockReporter;
    });

    test('should call the transform function', (done) => {
      webpack(conf, () => {
        expect(mockReporter.mock.calls.length).toBeTruthy();
        done();
      });
    });
  });

  describe('with default settings', () => {
    test('should emit warnings', (done) => {
      conf.entry = './test/fixtures/failure.js';
      webpack(conf, (err, stats) => {
        const hasWarnings = stats.hasWarnings();
        expect(hasWarnings).toBeTruthy();
        done();
      });
    });

    test('should not emit errors', (done) => {
      webpack(conf, (err, stats) => {
        const hasErrors = stats.hasErrors();
        expect(hasErrors).toBeFalsy();
        done();
      });
    });
  });
});
