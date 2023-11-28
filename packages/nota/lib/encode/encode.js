// @ts-check
import { NOTA_FALSE, NOTA_TRUE } from '../symbols.js';
import { encode_float } from './encode-float.js';
import { encode_integer } from './encode-integer.js';
import { encode_array_preamble, encode_record_preamble } from './encode-preambles.js';
import { encode_text } from './encode-text.js';

const floor = Math.floor;

/**
 * Encode Nota message
 * @param {any} input
 * @returns {Uint8Array}
 */
export function nota_encode(input) {
  let queue = [input];
  /** @type {Array<Uint8Array>} */
  let chunks = [];
  let message_length = 0;
  let item;
  /** @type {Uint8Array} */
  let frame;
  let tmp;

  for (let i = 0; i < queue.length; i += 1) {
    item = queue[i];
    switch (typeof item) {
      case 'boolean':
        frame = new Uint8Array([item ? NOTA_TRUE : NOTA_FALSE]);
        break;
      case 'number':
        frame = floor(item) === item ? encode_integer(item) : encode_float(item);
        break;
      case 'string':
        frame = encode_text(item);
        break;
      case 'object':
        if (Array.isArray(item)) {
          frame = encode_array_preamble(item.length);
          queue.splice(i + 1, 0, ...item);
          break;
        }
        tmp = Object.entries(item);
        frame = encode_record_preamble(tmp.length);
        queue.splice(i + 1, 0, ...tmp.flat(1));
        break;
      default:
        throw new TypeError(`unexpected input ${item}`);
    }
    chunks.push(frame);
    message_length += frame.length;
  }

  const result = new Uint8Array(message_length);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}
