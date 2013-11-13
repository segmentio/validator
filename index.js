
var Batch = require('batch');
var each;
var once;


/**
 * Try to require from component and node
 */

try {
  each = require('each');
  once = require('once');
} catch (err) {
  each = require('each-component');
  once = require('once-component');
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
  callback = once(callback);
  var batch = new Batch();
  var rules = this.rules;

  each(rules, function (rule) {
    batch.push(function (done) {
      // dont handle errors so that things like fs.exists work
      var finish = function (valid) { done(null, valid); };
      // handle sync or async validators
      rule.fn.length > 1
        ? rule.fn(value, finish)
        : finish(rule.fn(value));
    });
  });

  batch.on('progress', function (data) {
    if (data.value && !data.err) return;
    var context = rules[data.index].context;
    callback(false, context);
  });

  batch.end(function (err, res) {
    callback(true);
  });

  return this;
};