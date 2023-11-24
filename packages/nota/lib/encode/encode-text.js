// @ts-check
import { encode_string, encode_uint } from '@tkustov/kim-encoding';
import { TYPE_TEXT } from '../type-markers.js';

/**
 * Encode string to text block of Nota message format
 * @param {string} input
 * @param {NotaEncodeCb} cont
 */
export function encode_text(input, cont) {
  const preamble = encode_text_premble(codepoints_count(input));
  const text = encode_string(input);
  new Blob([preamble.buffer, text.buffer])
    .arrayBuffer()
    .then(data => cont(new Uint8Array(data)))
    .catch(err => cont(undefined, err));
}

/**
 * Encode Nota text block preamble
 * @param {number} length - number of characters (Unicode codepoints)
 * @returns {Uint8Array}
 */
function encode_text_premble(length) {
  const result = encode_uint(length, 3);
  result[0] = result[0] | TYPE_TEXT;
  return result;
}

/**
 * Count string codepoints
 * @param {string} text
 * @returns {number}
 */
function codepoints_count(text) {
  /** @type {number|undefined} */
  let codepoint;
  let count = 0;
  let i = 0;
  while (i < text.length) {
    codepoint = text.codePointAt(i);
    if (codepoint === undefined) break;
    count += 1;
    if (codepoint <= 0xFFFF) {
      i += 1;
    } else {
      i += 2;
    }
  }
  return count;
}
