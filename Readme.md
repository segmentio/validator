# validator

  Validate a value against a set of rules.

## Installation

    $ component install segmentio/validator

## Example

```js
var Validator = require('validator');

Validator()
  .rule(required, 'required')
  .rule(isEmail, 'email')
  .validate('test', function (valid, context) {
    valid; // false
    context; // "email"
  });
```

## API

### Validator()
  
  Create a new `Validator`.

### #rule(fn, [context])
  
  Add a new rule `fn` to the validator, with an optional `context`. 

### #validate(value, callback)

  Validate the given `value`. If the validation fails, the `context` from the associated rule will be passed to the `callback`.
  
## License

  MIT
