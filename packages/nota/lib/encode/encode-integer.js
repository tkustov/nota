// @ts-check
import { encode_uint } from '@tkustov/kim-encoding';
import { TYPE_INTEGER } from '../type-markers.js';

const CONT_BIT = 0b00001000;
const NEGATIVE_BIT = 0b00001000;
const UNSIGNED_MASK = 0b11110111;

/**
 * Encode number to integer block of Nota message format
 * @param {number} input
 * @param {NotaEncodeCb} cont
 */
export function encode_integer(input, cont) {
  const is_positive = input >= 0;
  const result = encode_uint(is_positive ? input : -input, 4);
  result[0] = result[0] | TYPE_INTEGER;
  result[0] = (result[0] & UNSIGNED_MASK) | ((result[0] & CONT_BIT) << 1);
  if (!is_positive) {
    result[0] = result[0] | NEGATIVE_BIT;
  }
  setTimeout(cont, 0, result);
}
