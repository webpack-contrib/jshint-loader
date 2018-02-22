"use strict";

var should = require("should");
var config = require("./webpack.config");
var webpack = require("webpack");
var sinon = require("sinon");
var loadRcConfig = require("../lib/loadRcConfig");

describe("jshint loader", function() {

	var conf = {};

	beforeEach(function() {
		conf = Object.assign({}, config, {
			entry: ["./test/mocks/default.js", "./test/mocks/ignored.jsx"]
		});
	});

	it("should find and coalesce nested .jshintrc files", function() {
		var host = {
			resourcePath: conf.entry[0],
			addDependency: function() {}
		};
		loadRcConfig.call(host).should.deepEqual({
			bitwise: true,
			expr: true,
			shadow: true,
			mocha: true,
			node: true,
			quotmark: "double"
		});
	});

	it("should respect & overwrite lint options in webpack config", function (done) {

		conf.jshint = {
			asi: true
		};

		webpack(conf, function(err, stats) {

			var hasWarnings = stats.hasWarnings();
			hasWarnings.should.not.be.ok();
			done();
		});
	});

	it("should emit errors when emitErrors is enabled", function(done) {
		conf.jshint = {
			emitErrors: true
		};

		webpack(conf, function(err, stats) {
			var hasErrors = stats.hasErrors();
			var hasWarnings = stats.hasWarnings();

			hasErrors.should.be.ok();
			hasWarnings.should.not.be.ok();
			done();
		});
	});

	it("should stop compilation when failOnHint is enabled", function (done) {
		conf.bail = true;
		conf.jshint = {
			emitErrors: true,
			failOnHint: true
		};

		webpack(conf, function(err) {
			err.should.not.be.null();
			done();
		});
	});

	// TODO: Write tests for context and arguments
	describe("custom transform", function() {

		var spy;
		var self = this;

		beforeEach(function() {
			spy = sinon.spy();

			conf.jshint = {
				reporter: spy
			};
		});

		it("should call the transform function", function(done) {
			webpack(conf, function(err, stats) {
				spy.called.should.be.ok();
				done();
			});
		});
	});

	describe("with default settings", function() {
		it("should include files with non-'js' extensions", function(done) {
			conf.entry.push("./test/mocks/invalid.jsx")

			webpack(conf, function(err, stats) {
				var hasWarnings = stats.hasWarnings();
				hasWarnings.should.be.ok();
				done();
			})
		});

		it("should emit warnings", function(done) {

			webpack(conf, function(err, stats) {

				var hasWarnings = stats.hasWarnings();
				hasWarnings.should.be.ok();
				done();
			});
		});

		it("should not emit errors", function(done) {

			webpack(conf, function(err, stats) {

				var hasErrors = stats.hasErrors();
				hasErrors.should.not.be.ok();
				done();
			});
		});
	});

});
