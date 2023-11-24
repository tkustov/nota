// @ts-check
import { describe, it } from 'node:test';
import { deepEqual } from 'node:assert/strict';
import { encode_text } from '../lib/encode/encode-text.js';

describe('encode_text', () => {
  it('should encode simple ASCII text', (t, done) => {
    encode_text('cat', (data, err) => {
      if (err) {
        done(err);
        return;
      }
      try {
        deepEqual(data, new Uint8Array([0x23, 0x63, 0x61, 0x74]));
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('should encode complex Unicode text', (t, done) => {
    encode_text('☃★♲', (data, err) => {
      if (err) {
        done(err);
        return;
      }
      try {
        deepEqual(data, new Uint8Array([0x23, 0xCC, 0x03, 0xCC, 0x05, 0xCC, 0x72]));
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('should encode complex Unicode text 2', (t, done) => {
    encode_text('𓂀𓃠𓅣𓂻𓂺𓁟𓂑𓃻𓇼𓊽𓂭𓎆𓍢𓏢𓐠', (data, err) => {
      if (err) {
        done(err);
        return;
      }
      try {
        deepEqual(data, new Uint8Array([
          0x2F, 0x84, 0xE1, 0x00, 0x84, 0xE1, 0x60, 0x84, 0xE2, 0x63,
          0x84, 0xE1, 0x3B, 0x84, 0xE1, 0x3A, 0x84, 0xE0, 0x5F, 0x84,
          0xE1, 0x11, 0x84, 0xE1, 0x7B, 0x84, 0xE3, 0x7C, 0x84, 0xE5,
          0x3D, 0x84, 0xE1, 0x2D, 0x84, 0xE7, 0x06, 0x84, 0xE6, 0x62,
          0x84, 0xE7, 0x62, 0x84, 0xE8, 0x20
        ]));
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
