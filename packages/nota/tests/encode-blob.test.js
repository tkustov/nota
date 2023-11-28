// @ts-check
import { describe, it } from 'node:test';
import { deepEqual } from 'node:assert/strict';
import { encode_blob } from '../lib/encode/encode-blob.js';

describe('encode_blob', () => {
  it('should encode blobs', () => {
    const data = encode_blob(new Uint8Array([0x42, 0x77, 0x25]).buffer);
    deepEqual(data, new Uint8Array([0x10, 0x18, 0x42, 0x77, 0x25]))
  });
});
