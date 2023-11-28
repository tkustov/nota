// @ts-check
import { encode_uint } from '@tkustov/kim-encoding';
import { TYPE_BLOB } from '../type-markers.js';

/**
 * @callback EncodeBlobCb
 * @param {Uint8Array} [data]
 * @param {Error} [err]
 */

/**
 * Encode Blob to Nota format
 * @param {ArrayBuffer} input
 * @returns {Uint8Array}
 */
export function encode_blob(input) {
  const preamble = encode_blob_preamble(input.byteLength * 8);
  const result = new Uint8Array(preamble.length + input.byteLength);
  result.set(preamble, 0);
  result.set(new Uint8Array(input), preamble.length);
  return result;
}

/**
 * Encode Blob preamble
 * @param {number} size - size of blob in bits (yes, in bits, not bytes)
 * @returns {Uint8Array}
 */
function encode_blob_preamble(size) {
  const encoded = encode_uint(size, 3);
  encoded[0] = encoded[0] | TYPE_BLOB;
  return encoded;
}
