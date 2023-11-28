// @ts-check

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { decode_string } from './kim-encoding.js';

describe('decode_string', () => {
  it('should decode single-byte chars', () => {
    assert.deepEqual(
      decode_string(new Uint8Array([0x63, 0x61, 0x74])),
      { ok: true, value: 'cat', size: 3 }
    );
  });

  it('should properly decode multi-byte chars', () => {
    assert.deepEqual(
      decode_string(new Uint8Array([0xCC, 0x03, 0xCC, 0x05, 0xCC, 0x72])),
      { ok: true, value: '☃★♲', size: 6 }
    );
  });
});
