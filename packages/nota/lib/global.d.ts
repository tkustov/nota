export {};

type EncodeCbParams =
  | [data: Uint8Array, err?: undefined]
  | [data: void, err: Error];

declare global {
  type NotaEncodeCb = (...args: EncodeCbParams) => void;
}
