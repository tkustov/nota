// @ts-check

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { encode_string } from './kim-encoding.js';

describe('encode_string', () => {
  it('should encode ASCII chars into 1 byte', () => {
    assert.deepEqual(encode_string('cat'), new Uint8Array([0x63, 0x61, 0x74]));
  });

  it('should properly encode multi-byte chars', () => {
    assert.deepEqual(encode_string('☃★♲'), new Uint8Array([0xCC, 0x03, 0xCC, 0x05, 0xCC, 0x72]));
  });
});
