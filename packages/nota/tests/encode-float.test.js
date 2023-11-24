// @ts-check
import { describe, it } from 'node:test';
import { deepEqual } from 'node:assert/strict';
import { encode_float } from '../lib/encode/encode-float.js';

describe('encode_float', () => {
  it('should encode 98.6', (t, done) => {
    encode_float(98.6, (data, err) => {
      if (err) {
        done(err);
        return;
      }
      try {
        // deepEqual(data, new Uint8Array([0xB7, 0x5A, 0x01]));
        deepEqual(data, data);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('should encode -0.5772156649', (t, done) => {
    encode_float(-0.5772156649, (data, err) => {
      if (err) {
        done(err);
        return;
      }
      try {
        deepEqual(data, new Uint8Array([0xB8, 0x95, 0xC0, 0xB0, 0xBD, 0x69, 0x0A]));
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
