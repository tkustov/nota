// @ts-check

const KIM_DATA_BIT_PER_BYTE = 7;
const KIM_CONT_MASK = 0x80;
const KIM_DATA_MASK = 0x7F;

/**
 * Multipies by 7 w/o multiply operation
 * @param {number} n - multiplicand
 * @returns {number}
 */
function mul7(n) {
  return (n << 3) - n;
}

/**
 * Encode unsigned int to sequence of bytes
 * @param {number} value - unsigned integer to encode
 * @param {number} [indent] - bits of indentation for leading byte
 * @returns {Uint8Array}
 */
export function encode_uint(value, indent = 0) {
  if (value < 0) {
    throw new RangeError(`expected to be unsigned integer, but got ${value} instead`);
  }
  if (indent < 0 || indent > 7) {
    throw new RangeError(`indent exepected to be in range [0, 7] but got ${indent} instead`);
  }
  let bits = 0;
  while (value >= (1 << bits)) {
    bits += 1;
  }
  const high_bits = KIM_DATA_BIT_PER_BYTE - indent;
  if (bits <= high_bits) {
    return new Uint8Array([value]);
  }
  // [IICDDDDD][CDDDPPPP]
  //             TTT
  // I - indentation bits
  // C - continuation
  // D - data bits
  // P - padding
  // T - tail (dangling bits)
  const dangling_bits = (bits - high_bits) % KIM_DATA_BIT_PER_BYTE;
  const padding = dangling_bits > 0 ? (KIM_DATA_BIT_PER_BYTE - dangling_bits) : 0;
  const bytes = Math.ceil((bits + padding) / KIM_DATA_BIT_PER_BYTE);
  const result = new Uint8Array(bytes);
  let shift = mul7(bytes - 1);
  let cont_bit;
  for (let i = 0; i < bytes; i += 1) {
    if (i === 0) {
      cont_bit = (KIM_CONT_MASK >> indent);
    } else if (i === bytes - 1) {
      cont_bit = 0;
    } else {
      cont_bit = KIM_CONT_MASK;
    }
    result[i] = cont_bit | ((value >> shift) & KIM_DATA_MASK);
    shift -= KIM_DATA_BIT_PER_BYTE;
  }
  return result;
}

/**
 * @callback DecodeUintContinuation
 * @param {number|undefined} result
 * @param {number} consumed_bytes
 * @param {Error} [error]
 */

/**
 * Decode Kim-encoded number to number
 * @param {ArrayLike<number>} encoded - Kim-encoded unsigned integer
 * @param {number} offset - offset of the first byte of sequence
 * @param {number} indent - first byte indentation in bits
 * @param {DecodeUintContinuation} cont
 */
export function decode_uint(encoded, offset = 0, indent = 0, cont) {
  let result = 0;
  /** @type {number} */
  let byte;
  /** @type {boolean} */
  let is_last_byte;
  for (let i = offset; i < encoded.length; i += 1) {
    byte = encoded[i];
    result = result << KIM_DATA_BIT_PER_BYTE;
    if (i === offset) {
      result = result | (byte & (KIM_DATA_MASK >> indent));
      is_last_byte = (byte & (KIM_CONT_MASK >> indent)) === 0;
    } else {
      result = result | (byte & KIM_DATA_MASK);
      is_last_byte = (byte & KIM_CONT_MASK) === 0
    }
    if (is_last_byte) {
      cont(result, i - offset + 1);
      return;
    }
  }
  cont(undefined, 0, new RangeError('Unexpected end of input'));
}

/**
 * Encode string to sequence of bytes
 * @param {string} input - string to encode
 * @returns {Uint8Array}
 */
export function encode_string(input) {
  /** @type {Array<Uint8Array>} */
  const chunks = [];
  /** @type {number|undefined} */
  let codepoint;
  /** @type {Uint8Array} */
  let encoded;
  let totalLength = 0;
  let i = 0;
  while (i < input.length) {
    codepoint = input.codePointAt(i);
    if (codepoint === undefined) {
      throw new RangeError('Unexpected end of input');
    }
    i += codepoint <= 0xFFFF ? 1 : 2;
    encoded = encode_uint(codepoint);
    chunks.push(encoded);
    totalLength += encoded.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/**
 * Decode Kim-encoded string
 * @param {ArrayLike<number>} input
 * @param {number} offset
 * @param {number} [length]
 * @returns {string}
 */
export function decode_string(input, offset = 0, length) {
  /** @type {Array<string>} */
  const chars = [];
  /** @type {number} */
  let i = offset;
  while (i < input.length) {
    decode_uint(input, i, 0, (codepoint, size, error) => {
      if (codepoint === undefined) {
        throw error;
      }
      chars.push(String.fromCodePoint(codepoint));
      i += size;
    });
    if (chars.length === length) {
      break;
    }
  }
  return chars.join('');
}
