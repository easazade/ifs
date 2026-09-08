import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export function createAjv() {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
  });

  addFormats(ajv);
  ajv.addFormat('ifs-ref', true);

  return ajv;
}
