
var tick = require('next-tick');
var ware = require('ware');
var once;


/**
 * Try to require from component and node
 */

try {
  each = require('each');
} catch (err) {
  each = require('each-component');
}


/**
 * Expose `Validator`.
 */

module.exports = Validator;


/**
 * Initialize a new `Validator`.
 */

function Validator () {
  if (!(this instanceof Validator)) return new Validator();
  this.rules = [];
}


/**
 * Add a new rule `fn`, with optional `context`.
 *
 * @param {Function} fn
 * @param {Mixed} context (optional)
 * @return {Validator}
 */

Validator.prototype.rule = function (fn, context) {
  this.rules.push({
    fn: fn,
    context: context
  });
  return this;
};


/**
 * Kick off the validation against all our rules.
 *
 * @param {Function} callback(valid, [context])
 * @return {Validator}
 */

Validator.prototype.validate = function (value, callback) {
  var rules = this.rules;
  var middleware = ware();

  each(rules, function (rule) {
    middleware.use(function (value, done) {
      // dont handle errors so that things like fs.exists work
      var finish = function (valid) {
        if (valid) return done();
        var err = new Error('Validation Error');
        err.rule = rule;
        done(err);
      };

      // handle sync or async validators
      rule.fn.length > 1
        ? rule.fn(value, finish)
        : tick(function () { finish(rule.fn(value)); });
    });
  });

  middleware.run(value, function (err) {
    if (err) return callback(false, err.rule.context);
    return callback(true);
  });

  return this;
};