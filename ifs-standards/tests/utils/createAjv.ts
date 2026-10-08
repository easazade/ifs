import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export function createAjv() {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
  });

  // Generated relationship metadata is an annotation, not an instance validation constraint.
  ajv.addKeyword({ keyword: 'x-ifs-relationships', schemaType: 'array', valid: true });
  addFormats(ajv);

  return ajv;
}
