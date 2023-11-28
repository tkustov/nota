// @ts-check
import { performance } from 'node:perf_hooks';
import { nota_encode } from '../lib/encode/encode.js';

const DATA = { a: ['124'], o: { a: 1 }, b: false, i: 424242, f: 123.42, x: [{ a: ['124'], o: { a: 1 }, b: false, i: 424242, f: 123.42 }] };

console.log('Nota', nota_encode(DATA).length, measure(() => { nota_encode(DATA) }, 10_000));
console.log('JSON', JSON.stringify(DATA).length, measure(() => { JSON.stringify(DATA) }, 10_000));

function measure(worker, count = 100) {
  const ms = new Array(count);
  // warmup
  worker();

  let start_at;
  for (let i = 0; i < count; i += 1) {
    start_at = performance.now();
    worker();
    ms[i] = performance.now() - start_at;
  }

  return ms.reduce((acc, v) => acc + v, 0) / count;
}
