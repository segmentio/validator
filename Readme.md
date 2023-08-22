
# validator

> **Note**  
> Segment has paused maintenance on this project, but may return it to an active status in the future. Issues and pull requests from external contributors are not being considered, although internal contributions may appear from time to time. The project remains available under its open source license for anyone to use.

  Validate a value against a set of rules.

## Installation

    $ npm install @segment/validator

## Example

```js
var Validator = require('validator');

Validator()
  .rule(required, 'required')
  .rule(isEmail, 'email')
  .validate('test', function (err, valid, context) {
    valid; // false
    context; // "email"
  });
```

## API

### Validator(options)

  Create a new `Validator` with `options`:

    {
      optional: false  // whether return true on empty values
    }

### #rule(fn, [context])

  Add a new rule `fn` to the validator, with an optional `context`.

### #validate(value, callback)

  Validate the given `value`. If the validation fails, the `context` from the associated rule will be passed to the `callback`.

## Probes

  - `validator:<function-name>:start`
  - `validator:<function-name>:end`

## License

  MIT
