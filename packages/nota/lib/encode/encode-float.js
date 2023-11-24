// @ts-check
import { encode_bigint, encode_uint } from '@tkustov/kim-encoding';
import { TYPE_FLOAT } from '../type-markers.js';

const is_finite = Number.isFinite;
const is_nan = Number.isNaN;

/**
 * Encode float block of Nota message format
 * @param {number} input
 * @param {NotaEncodeCb} cont
 */
export function encode_float(input, cont) {
  try {
    const {
      exponent,
      exponent_sign,
      significand,
      significand_sign
    } = parse_float(input);
    const coefficient = encode_bigint(significand, 4);
    coefficient[0] = coefficient[0] | TYPE_FLOAT;
    coefficient[0] = coefficient[0] | (exponent_sign << 4);
    coefficient[0] = coefficient[0] | (significand_sign << 3);
    const exp_cont = encode_uint(exponent);
    new Blob([coefficient, exp_cont])
      .arrayBuffer()
      .then(data => cont(new Uint8Array(data)))
      .catch(err => cont(undefined, err));
  } catch (err) {
    setTimeout(cont, 0, undefined, err);
  }
}

/**
 * @typedef {Object} FloatParsed
 * @property {number} exponent_sign
 * @property {number} exponent
 * @property {number} significand_sign
 * @property {bigint} significand
 */

const re_decimal = /^-?(\d+)(?:\.(\d+))?(?:e([-+]\d+))?$/i;
const ASCII_ZERO = 48;

/**
 * @param {number} input
 * @returns {FloatParsed}
 */
function parse_float(input) {
  if (!is_finite(input)) {
    throw new RangeError('finite number expected');
  }
  if (is_nan(input)) {
    throw new TypeError('number expected');
  }
  const match = re_decimal.exec(input.toString(10));
  if (!match) {
    throw new TypeError(`expected float number, got "${input}"`);
  }
  const [, integer, fraction, epsilon] = match;
  let significand = BigInt(integer);
  let exponent = -fraction.length;
  for (let i = 0; i < fraction.length; i += 1) {
    significand = significand * 10n + BigInt(fraction.charCodeAt(i) - ASCII_ZERO);
  }
  if (epsilon) {
    exponent += parseInt(epsilon, 10);
  }
  return {
    exponent_sign: Math.sign(exponent) < 0 ? 1 : 0,
    exponent: Math.abs(exponent),
    significand_sign: Math.sign(input) < 0 ? 1 : 0,
    significand
  };
}
