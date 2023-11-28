// @ts-check
import { describe, it } from 'node:test';
import { deepEqual } from 'node:assert/strict';
import { encode_float } from '../lib/encode/encode-float.js';

describe('encode_float', () => {
  it('should encode 98.6', () => {
    deepEqual(encode_float(98.6), new Uint8Array([0xB7, 0x5A, 0x01]));
  });

  it('should encode -0.5772156649', () => {
    deepEqual(encode_float(-0.5772156649), new Uint8Array([0xB8, 0x95, 0xC0, 0xB0, 0xBD, 0x69, 0x0A]));
  });

  it('should encode 123.42', () => {
    deepEqual(encode_float(123.42), new Uint8Array([0xB0, 0xE0, 0x36, 0x02]));
  });
});
