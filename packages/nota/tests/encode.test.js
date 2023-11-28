// @ts-check
import { describe, it } from 'node:test';
import { deepEqual } from 'node:assert/strict';
import { nota_encode } from '../lib/encode/encode.js';

describe('encode', () => {
  it('should encode random "JSON"', () => {
      deepEqual(
        nota_encode({ a: ['124'], o: { a: 1 }, b: false, i: 424242, f: 123.42 }),
        new Uint8Array([
          0x65,
          0x21, 0x61, 0x41, 0x23, 0x31, 0x32, 0x34,
          0x21, 0x6F, 0x61, 0x21, 0x61, 0x81,
          0x21, 0x62, 0xC0,
          0x21, 0x69, 0x90, 0x99, 0xF2, 0x32,
          0x21, 0x66, 0xB0, 0xE0, 0x36, 0x02
        ])
      );
  });
});
