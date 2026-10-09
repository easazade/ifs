import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { readEntitySchemas } from '../../scripts/entity-schema';

export function createAjv() {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    // Open schemas and allOf may require fields defined outside the current subschema.
    strictRequired: false,
  });

  // Generated relationship metadata is an annotation, not an instance validation constraint.
  ajv.addKeyword({ keyword: 'x-ifs-relationships', schemaType: 'array', valid: true });
  ajv.addKeyword({ keyword: 'x-ifs-id', schemaType: 'boolean', valid: true });
  ajv.addKeyword({ keyword: 'x-ifs-abstract', schemaType: 'boolean', valid: true });
  addFormats(ajv);

  // Register canonical IDs locally, including circular entity relations; never fetch schema URLs.
  for (const schema of readEntitySchemas('src/entities').values()) ajv.addSchema(schema);
  return ajv;
}
