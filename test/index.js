
describe('validator', function () {

  var assert = require('assert');
  var noop = function(){};
  var Validator = require('validator');

  function isString (string) {
    return 'string' == typeof string;
  }

  function isNumber (number, done) {
    setTimeout(function () {
      done(null, 'number' == typeof number);
    }, 1);
  }

  describe('#rule', function () {
    it('should be chainable', function () {
      var validator = Validator();
      assert(validator == validator.rule(noop));
    });

    it('should add to #rules', function () {
      var validator = Validator().rule(noop);
      assert(1 == validator.rules.length);
    });

    it('should take an optional context', function () {
      var validator = Validator().rule(noop, 'context');
      assert('context' == validator.rules[0].context);
    });
  });

  describe('#validate', function () {
    it('should pass synchronous validators', function (done) {
      Validator()
        .rule(isString)
        .validate('string', function (err, valid) {
          assert(!err);
          assert(valid);
          done();
        });
    });

    it('should fail synchronous validators', function (done) {
      Validator()
        .rule(isString)
        .validate(42, function (err, valid) {
          assert(!err);
          assert(!valid);
          done();
        });
    });

    it('should pass async validators', function (done) {
      Validator()
        .rule(isNumber)
        .validate(42, function (err, valid) {
          assert(!err);
          assert(valid);
          done();
        });
    });

    it('should fail async validators', function (done) {
      Validator()
        .rule(isNumber)
        .validate('string', function (err, valid) {
          assert(!err);
          assert(!valid);
          done();
        });
    });

    it('should send along a context', function (done) {
      Validator()
        .rule(isString, 'string')
        .rule(isNumber, 'number')
        .validate(42, function (err, valid, context) {
          assert(!err);
          assert(!valid);
          assert('string' == context);
          done();
        });
    });

    it('should fail on the first invalid rule', function (done) {
      Validator()
        .rule(function (obj) { return obj; }, 'obj')
        .rule(function (obj) { return obj.x; }, 'obj.x')
        .validate(null, function (err, valid, context) {
          assert(!err);
          assert(!valid);
          assert('obj' == context);
          done();
        });
    });

    it('should pass back errors unrelated to validation', function (done) {
      Validator()
        .rule(function (obj, cb) { return cb(new Error('error')); })
        .rule(function (obj) { return obj.x; })
        .validate(null, function (err, valid, context) {
          assert(err);
          done();
        });
    });
  });

  describe('#optional', function () {
    it('should pass on empty values', function (done) {
      Validator()
        .optional()
        .rule(isString, 'string')
        .validate(null, function (err, valid, context) {
          assert(!err);
          assert(valid);
          done();
        });
    });
  });
});