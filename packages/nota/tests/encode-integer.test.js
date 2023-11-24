// @ts-check
import { describe, it } from 'node:test';
import { deepEqual } from 'node:assert/strict';
import { encode_integer } from '../lib/encode/encode-integer.js';

describe('encode_integer', () => {
  it('should encode 0 to one byte', (t, done) => {
    encode_integer(0, (data, err) => {
      if (err) {
        done(err);
        return;
      }
      try {
        deepEqual(data, new Uint8Array([0x80]));
        done();
      } catch (err) {
        done(err);
      }
    })
  });

  it('should encode 2023 to correct sequence', (t, done) => {
    encode_integer(2023, (data, err) => {
      if (err) {
        done(err);
        return;
      }
      try {
        deepEqual(data, new Uint8Array([0x90, 0x8F, 0x67]));
        done();
      } catch (err) {
        done(err);
      }
    })
  });

  it('should encode -1 to correct sequence', (t, done) => {
    encode_integer(-1, (data, err) => {
      if (err) {
        done(err);
        return;
      }
      try {
        deepEqual(data, new Uint8Array([0x89]));
        done();
      } catch (err) {
        done(err);
      }
    })
  });
});
