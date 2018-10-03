'use strict';

var Ajv  = require('ajv');

var ajv = new Ajv({
  removeAdditional: true,
  schemaId: 'id',
  validateSchema: 'log',
  unknownFormats: [
    'int32',
    'int64',
    'byte',
    'float',
    'double'
  ]
});
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
ajv.addFormat('date-time', '.*');
ajv.addFormat('date', '.*');

module.exports = ajv;

