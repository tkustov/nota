import { decode_uint, encode_uint } from './kim-encoding.js';

function* codepoints(input) {
  let i = 0;
  let cp;
  while (i < input.length) {
    cp = input.codePointAt(i);
    if (cp <= 0xFFFF) {
      i += 1;
    } else {
      i += 2;
    }
    yield cp;
  }
  return;
}

const inputs = ['cat', '☃★♲'];
let encoded;
let cps = [];

for (const input of inputs) {
  encoded = [];
  cps = [];
  for (const cp of codepoints(input)) {
    cps.push(cp);
    encoded.push(...encode_uint(cp));
  }
  console.log(input);
  console.log(cps);
  console.log(String.fromCodePoint(decode_uint(encoded)));
  console.log(
    encoded
      .map(v => v.toString(16).padStart(2, '0'))
      .join(' ')
  );
  console.log(
    encoded
      .map(v => v.toString(2).padStart(8, '0'))
      .join(' ')
  );
  console.log('---');
}
