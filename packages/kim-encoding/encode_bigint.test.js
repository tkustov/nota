// @ts-check

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { encode_bigint } from './kim-encoding.js';

describe('encode_bigint', () => {
  it('should encode 7bit w/o indent to single byte', () => {
    assert.deepEqual(encode_bigint(0n), new Uint8Array([0]), 'expected 0 to be encoded as 0');
    assert.deepEqual(encode_bigint(1n), new Uint8Array([1]), 'expected 1 to be encoded as 1');
    assert.deepEqual(encode_bigint(0x7Fn), new Uint8Array([0x7F]), 'expected 0x7F to be encoded as 0x7F');
  });

  it('should encode >7bit to sequence of bytes', () => {
    assert.deepEqual(encode_bigint(0x8Fn), new Uint8Array([0x81, 0x0F]), 'expected 0x8F to be encoded as 0x810F');
    // 0x8001   = 0b1000_0000_0000_0001
    // 0x828001 = 0b1000_0010_1000_0000_0000_0001
    assert.deepEqual(encode_bigint(0x8001n), new Uint8Array([0x82, 0x80, 0x01]), 'expected 0x8001 to be encoded as 0x828001');
  });

  it('should accept first byte indentation', () => {
    assert.deepEqual(encode_bigint(7n, 4), new Uint8Array([7]), 'expected 7 w/ indent=4 should fit in 1 byte');
    assert.deepEqual(encode_bigint(7n, 5), new Uint8Array([0b0000_0100, 0b0000_0111]), 'expected 7 w/ indent=5 should consume 2 bytes');
    // 0x8001   = 0b1000_0000_0000_0001
    // 0x828001 = 0b0000_0110_1000_0000_0000_0001
    assert.deepEqual(encode_bigint(0x8001n, 5), new Uint8Array([0x06, 0x80, 0x01]), 'expected 0x8001 w/ indent=5 fits 3 bytes');
    // 0x8001     = 0b1000_0000_0000_0001
    // 0x02818001 = 0b0000_0010_1000_0010_1000_0000_0000_0001
    assert.deepEqual(encode_bigint(0x8001n, 6), new Uint8Array([0x02, 0x82, 0x80, 0x01]), 'expected 0x8001 w/ indent=6 to consume 4 bytes');
  });
});
