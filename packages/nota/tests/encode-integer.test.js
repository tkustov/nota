// @ts-check
import { describe, it } from 'node:test';
import { deepEqual } from 'node:assert/strict';
import { encode_integer } from '../lib/encode/encode-integer.js';

describe('encode_integer', () => {
  it('should encode 0 to one byte', () => {
    deepEqual(encode_integer(0), new Uint8Array([0x80]));
  });

  it('should encode 2023 to correct sequence', () => {
    deepEqual(encode_integer(2023), new Uint8Array([0x90, 0x8F, 0x67]));
  });

  it('should encode -1 to correct sequence', () => {
    deepEqual(encode_integer(-1), new Uint8Array([0x89]));
  });
});
