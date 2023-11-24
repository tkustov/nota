// @ts-check

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { decode_bigint } from './kim-encoding.js';

describe('decode_bigint', () => {
  it('should encode 7bit w/o indent to single byte', () => {
    assert.deepEqual(
      decode_bigint(new Uint8Array([0])),
      { ok: true, value: 0n, size: 1 }
    );
    assert.deepEqual(
      decode_bigint(new Uint8Array([1])),
      { ok: true, value: 1n, size: 1 }
    );
    assert.deepEqual(
      decode_bigint(new Uint8Array([0x7F])),
      { ok: true, value: 0x7Fn, size: 1 }
    );
  });

  it('should encode >7bit to sequence of bytes', () => {
    assert.deepEqual(
      decode_bigint(new Uint8Array([0x81, 0x0F])),
      { ok: true, value: 0x8Fn, size: 2 }
    );
    assert.deepEqual(
      decode_bigint(new Uint8Array([0x82, 0x80, 0x01])),
      { ok: true, value: 0x8001n, size: 3 }
    );
  });

  it('should accept first byte indentation', () => {
    assert.deepEqual(
      decode_bigint(new Uint8Array([7]), 0, 4),
      { ok: true, value: 7n, size: 1 }
    );
    assert.deepEqual(
      decode_bigint(new Uint8Array([0b0000_0100, 0b0000_0111]), 0, 5),
      { ok: true, value: 7n, size: 2 }
    );
    assert.deepEqual(
      decode_bigint(new Uint8Array([0x06, 0x80, 0x01]), 0, 5),
      { ok: true, value: 0x8001n, size: 3 }
    );
    assert.deepEqual(
      decode_bigint(new Uint8Array([0x02, 0x82, 0x80, 0x01]), 0, 6),
      { ok: true, value: 0x8001n, size: 4 }
    );
  });
});
