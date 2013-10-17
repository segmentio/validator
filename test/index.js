
describe('validator', function () {

  var assert = require('assert');
  var noop = function(){};
  var Validator = require('validator');

  function isString (string) {
    return 'string' == typeof string;
  }

  function isNumber (number, done) {
    setTimeout(function () {
      done('number' == typeof number);
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
        .validate('string', function (valid) {
          assert(valid);
          done();
        });
    });

    it('should fail synchronous validators', function (done) {
      Validator()
        .rule(isString)
        .validate(42, function (valid) {
          assert(!valid);
          done();
        });
    });

    it('should pass async validators', function (done) {
      Validator()
        .rule(isNumber)
        .validate(42, function (valid) {
          assert(valid);
          done();
        });
    });

    it('should fail async validators', function (done) {
      Validator()
        .rule(isNumber)
        .validate('string', function (valid) {
          assert(!valid);
          done();
        });
    });

    it('should send along a context', function (done) {
      Validator()
        .rule(isString, 'string')
        .rule(isNumber, 'number')
        .validate(42, function (valid, context) {
          assert(!valid);
          assert('string' == context);
          done();
        });
    });
  });
});