// @ts-check
import { encode_uint } from '@tkustov/kim-encoding';
import { TYPE_ARRAY, TYPE_RECORD } from '../type-markers.js';

/**
 * Encode Nota array preamble
 * @param {number} items_count
 * @returns {Uint8Array}
 */
export function encode_array_preamble(items_count) {
  const result = encode_uint(items_count, 3);
  result[0] = result[0] | TYPE_ARRAY;
  return result;
}

/**
 * Encode Nota record preamble
 * @param {number} enties_count
 * @returns {Uint8Array}
 */
export function encode_record_preamble(enties_count) {
  const result = encode_uint(enties_count, 3);
  result[0] = result[0] | TYPE_RECORD;
  return result;
}
