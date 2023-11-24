// @ts-check

const KIM_DATA_BITS_PER_BYTE = 7;
const KIM_CONT_MASK = 0x80;
const KIM_DATA_MASK = 0x7F;

/**
 * Return count of bytes needed for Kim-encoded sequence
 * @param {number} data_bits
 * @param {number} indent
 * @returns {number}
 */
function bytes_for_seq(data_bits, indent) {
  // [IICDDDDD][CDDDPPPP]
  //             TTT
  // I - indentation bits
  // C - continuation
  // D - data bits
  // P - padding
  // T - tail (dangling bits)
  const high_bits = KIM_DATA_BITS_PER_BYTE - indent;
  const tail = (data_bits - high_bits) % KIM_DATA_BITS_PER_BYTE;
  const padding = tail > 0 ? (KIM_DATA_BITS_PER_BYTE - tail) : 0;
  const bytes = Math.ceil((data_bits + padding) / KIM_DATA_BITS_PER_BYTE);
  return bytes;
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
  const high_bits = KIM_DATA_BITS_PER_BYTE - indent;
  if (bits <= high_bits) {
    return new Uint8Array([value]);
  }
  const bytes = bytes_for_seq(bits, indent);
  const result = new Uint8Array(bytes);
  let shift = (bytes - 1) * KIM_DATA_BITS_PER_BYTE;
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
    shift -= KIM_DATA_BITS_PER_BYTE;
  }
  return result;
}

/**
 * @typedef {Object} DecodeUintResultOk
 * @property {true} ok
 * @property {number} value - decoded number (unsigned int)
 * @property {number} size - amount of consumed bytes
 */

/**
 * @typedef {Object} DecodeUintResultErr
 * @property {false} ok
 * @property {Error} error
 */

/**
 * Decode Kim-encoded number to number
 * @param {ArrayLike<number>} encoded - Kim-encoded unsigned integer
 * @param {number} offset - offset of the first byte of sequence
 * @param {number} indent - first byte indentation in bits
 * @returns {DecodeUintResultOk | DecodeUintResultErr}
 */
export function decode_uint(encoded, offset = 0, indent = 0) {
  let result = 0;
  /** @type {number} */
  let byte;
  /** @type {boolean} */
  let is_last_byte;
  for (let i = offset; i < encoded.length; i += 1) {
    byte = encoded[i];
    result = result << KIM_DATA_BITS_PER_BYTE;
    if (i === offset) {
      result = result | (byte & (KIM_DATA_MASK >> indent));
      is_last_byte = (byte & (KIM_CONT_MASK >> indent)) === 0;
    } else {
      result = result | (byte & KIM_DATA_MASK);
      is_last_byte = (byte & KIM_CONT_MASK) === 0
    }
    if (is_last_byte) {
      return {
        ok: true,
        value: result,
        size: i - offset + 1
      };
    }
  }
  return {
    ok: false,
    error: new RangeError('Unexpected end of input')
  };
}

/**
 * Encode bigint to Kim-encoded sequence of bytes
 * if bigint is negative sign will be ignored
 * @param {bigint} bigint
 * @param {number} indent
 * @returns {Uint8Array}
 */
export function encode_bigint(bigint, indent) {
  if (bigint === 0n) {
    return new Uint8Array([0]);
  }
  if (indent < 0 || indent > 7) {
    throw new RangeError(`indent exepected to be in range [0, 7] but got ${indent} instead`);
  }
  /** @type {Array<number>} */
  const chunks = [];
  let data = bigint < 0 ? -bigint : bigint;
  while (data > 0) {
    if (chunks.length > 1) {
      chunks[chunks.length - 1] = chunks[chunks.length - 1] | KIM_CONT_MASK;
    }
    chunks.push(Number(BigInt.asUintN(KIM_DATA_BITS_PER_BYTE, data)));
    data = data >> BigInt(KIM_DATA_BITS_PER_BYTE);
  }
  // check if highest byte fits the first byte indent
  if ((chunks[chunks.length - 1] & (0x7F80 >>> (indent))) !== 0) {
    if (chunks.length > 1) {
      chunks[chunks.length - 1] = chunks[chunks.length - 1] | KIM_CONT_MASK;
    }
    chunks.push(0);
  }
  const result = new Uint8Array(chunks.reverse());
  if (result.length > 1) {
    result[0] = result[0] | (KIM_CONT_MASK >> indent);
  }
  return result;
}

/**
 * @typedef {Object} DecodeBigIntResultOk
 * @property {true} ok
 * @property {bigint} value - decoded number (unsigned int)
 * @property {number} size - amount of consumed bytes
 */

/**
 * @typedef {Object} DecodeBigIntResultErr
 * @property {false} ok
 * @property {Error} error
 */

/**
 * Decode Kim-encoded bigint to bigint
 * @param {ArrayLike<number>} encoded
 * @param {number} offset
 * @param {number} indent
 * @returns {DecodeBigIntResultOk | DecodeBigIntResultErr}
 */
export function decode_bigint(encoded, offset = 0, indent = 0) {
  let result = 0n;
  /** @type {number} */
  let byte;
  /** @type {boolean} */
  let is_last_byte;
  for (let i = offset; i < encoded.length; i += 1) {
    byte = encoded[i];
    result = result << BigInt(KIM_DATA_BITS_PER_BYTE);
    if (i === offset) {
      result = result | BigInt(byte & (KIM_DATA_MASK >> indent));
      is_last_byte = (byte & (KIM_CONT_MASK >> indent)) === 0;
    } else {
      result = result | BigInt(byte & KIM_DATA_MASK);
      is_last_byte = (byte & KIM_CONT_MASK) === 0
    }
    if (is_last_byte) {
      return {
        ok: true,
        value: result,
        size: i - offset + 1
      };
    }
  }
  return {
    ok: false,
    error: new RangeError('Unexpected end of input')
  };
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
  let i = offset;
  while (i < input.length) {
    let result = decode_uint(input, i, 0);
    if (result.ok === false) {
      throw result.error;
    }
    chars.push(String.fromCodePoint(result.value));
    i += result.size;
    if (chars.length === length) {
      break;
    }
  }
  return chars.join('');
}
