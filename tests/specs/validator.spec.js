var validator   = require('../../lib/validator'),
  expect = require('chai').expect;

describe('Validator - additional properties', function() {
  'use strict';

  it('should delete all additional properties',
      function() {
        var schema = {
          "properties": {
            "foo": { "type": "number" },
            "bar": {
              "properties": {
                "baz": { "type": "string" }
              }
            },
            additionalProperties: {"type": "string"}
          }
        };

        var data = {
          "foo": 3,
          "foo2": 4,
          "bar": {
            "baz": "4r"
          },
          "bar2": {
            "baz": "4h"
          }
        };

        const valid = validator.validate(schema, data);
        expect(valid).to.equal(true);
        expect(data).to.deep.equal({
          "foo": 3,
          "bar": {
            "baz": "4r"
          }
        });
      }
    );
});
