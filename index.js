
var ware = require('ware');
var each;

/**
 * Try to require from component and node
 */

try {
  each = require('each');
} catch (err) {
  each = require('each-component');
}

/**
 * Trace helper.
 *
 * TODO: move to npm
 */

function tracer(trace) {
  var ids = 0;
  return function(name, obj){
    var id = ++ids;
    obj = obj || {};
    obj.id = id;

    trace(name + ':start', obj);
    return function(obj){
      trace(name + ':end');
    }
  }
}

/**
 * Expose `Validator`.
 */

module.exports = Validator;

/**
 * Initialize a new `Validator`.
 */

function Validator (opts) {
  if (!(this instanceof Validator)) return new Validator(opts);
  opts = opts || {};
  this.trace = tracer(opts.trace || function(){});
  this.rules = [];
  this._optional = false;
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
 * @param {Function} callback(err, valid, [context])
 * @return {Validator}
 */

Validator.prototype.validate = function (value, callback) {
  var rules = this.rules;
  var optional = this._optional;
  var middleware = ware();
  var trace = this.trace;

  each(rules, function (rule) {
    middleware.use(function (value, done) {

      // handle optional setting
      if (!value && optional) return done();

      // dont handle errors so that things like fs.exists work
      var finish = function (err, valid) {
        if (err) return done(err);
        if (!valid) return done(new ValidationError(rule));
        done();
      };

      // async
      if (rule.fn.length > 1) {
        var end = trace('validator:' + rule.fn.name);
        return rule.fn(value, function(){
          end();
          finish.apply(null, arguments);
        });
      }

      // sync
      var end = trace('validator:' + rule.fn.name);
      var val = rule.fn(value);
      end();
      finish(null, val);
    });
  });

  middleware.run(value, function (err) {
    if (!err) return callback(null, true);
    if (err && err instanceof ValidationError) {
      return callback(null, false, err.rule.context);
    }
    return callback(err);
  });

  return this;
};

/**
 * Make the validator pass on empty values.
 *
 * @param {Boolean} optional
 * @return {Validator}
 */

Validator.prototype.optional = function (optional) {
  this._optional = false === optional ? false : true;
  return this;
};

/**
 * A simple error constructor to store the rule.
 */

function ValidationError (rule) {
  this.rule = rule;
}