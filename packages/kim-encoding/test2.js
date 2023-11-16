import { decode_string, encode_string } from './kim-encoding.js';

const inputs = ['cat', '☃★♲'];

for (const input of inputs) {
  console.log(input);
  const encoded = [...encode_string(input)];
  const decoded = decode_string(encoded);
  console.log(encoded);
  console.log(decoded);
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
