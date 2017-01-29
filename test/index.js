"use strict";

var should = require("should");
var loader = require("./index");
var config = require("./webpack.config");
var webpack = require("webpack");
var sinon = require("sinon");

describe("jshint loader", function() {

	var conf = {};
	var jshintOptionsRef = {};

	beforeEach(function() {
		conf = Object.assign({}, config, {
			entry: "./test/mocks/default.js"
		});
		jshintOptionsRef = conf.module.rules[0].options = {};
	});

	it("should respect & overwrite lint options in webpack config", function (done) {

		jshintOptionsRef.asi = true

		webpack(conf, function(err, stats) {
			var hasWarnings = stats.hasWarnings();
			hasWarnings.should.not.be.ok();
			done();
		});
	});

	it("should emit errors when emitErrors is enabled", function(done) {

		jshintOptionsRef.emitErrors = true

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
		jshintOptionsRef.emitErrors = true
		jshintOptionsRef.failOnHint = true;

		webpack(conf, function(err) {
			should(err).not.be.null();
			done();
		});
	});

	// TODO: Write tests for context and arguments
	describe("custom transform", function() {

		var spy;
		var self = this;

		beforeEach(function() {
			spy = sinon.spy();
			jshintOptionsRef.reporter = spy
		});

		it("should call the transform function", function(done) {
			webpack(conf, function(err, stats) {
				spy.called.should.be.ok();
				done();
			});
		});
	});

	describe("with default settings", function() {

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
