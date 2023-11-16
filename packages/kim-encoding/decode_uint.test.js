// @ts-check

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { decode_uint } from './kim-encoding.js';

describe('encode_uint', () => {
  it('should encode 7bit w/o indent to single byte', () => {
    decode_uint(new Uint8Array([0]), 0, 0, (result, bytes) => {
      assert.equal(result, 0);
      assert.equal(bytes, 1);
    });
    decode_uint(new Uint8Array([1]), 0, 0, (result, bytes) => {
      assert.equal(result, 1);
      assert.equal(bytes, 1);
    });
    decode_uint(new Uint8Array([0x7F]), 0, 0, (result, bytes) => {
      assert.equal(result, 0x7F);
      assert.equal(bytes, 1);
    });
  });

  it('should encode >7bit to sequence of bytes', () => {
    decode_uint(new Uint8Array([0x81, 0x0F]), 0, 0, (result, bytes) => {
      assert.equal(result, 0x8F);
      assert.equal(bytes, 2);
    });
    decode_uint(new Uint8Array([0x82, 0x80, 0x01]), 0, 0, (result, bytes) => {
      assert.equal(result, 0x8001);
      assert.equal(bytes, 3);
    });
  });

  it('should accept first byte indentation', () => {
    decode_uint(new Uint8Array([7]), 0, 4, (result, bytes) => {
      assert.equal(result, 7);
      assert.equal(bytes, 1);
    });
    decode_uint(new Uint8Array([0b0000_0100, 0b0000_0111]), 0, 5, (result, bytes) => {
      assert.equal(result, 7);
      assert.equal(bytes, 2);
    });
    decode_uint(new Uint8Array([0x06, 0x80, 0x01]), 0, 5, (result, bytes) => {
      assert.equal(result, 0x8001);
      assert.equal(bytes, 3);
    });
    decode_uint(new Uint8Array([0x02, 0x82, 0x80, 0x01]), 0, 6, (result, bytes) => {
      assert.equal(result, 0x8001);
      assert.equal(bytes, 4);
    });
  });
});
