/**
 * Encode unsigned int to sequence of bytes
 * @param {number} value - unsigned integer to encode
 * @param {number} [indent] - bits of indentation for leading byte
 * @returns {Uint8Array}
 */
export function encode_uint(value: number, indent?: number): Uint8Array;
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
export function decode_uint(encoded: ArrayLike<number>, offset: number, indent: number, cont: DecodeUintContinuation): void;
/**
 * Encode string to sequence of bytes
 * @param {string} input - string to encode
 * @returns {Uint8Array}
 */
export function encode_string(input: string): Uint8Array;
/**
 * Decode Kim-encoded string
 * @param {ArrayLike<number>} input
 * @param {number} offset
 * @param {number} [length]
 * @returns {string}
 */
export function decode_string(input: ArrayLike<number>, offset?: number, length?: number): string;
export type DecodeUintContinuation = (result: number | undefined, consumed_bytes: number, error?: Error) => any;
//# sourceMappingURL=kim-encoding.d.ts.map