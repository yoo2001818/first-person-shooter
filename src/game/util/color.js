// LOL
import leftPad from 'left-pad';

export function stringToVec(string) {
  // TODO: Handle #rgb form. We may want to use rgb(r, g, b) form, but
  // it's not necessary.
  if (string == null) return new Float32Array(3);
  let r = parseInt(string.slice(1, 3), 16);
  let g = parseInt(string.slice(3, 5), 16);
  let b = parseInt(string.slice(5, 7), 16);
  let vec = new Float32Array(3);
  vec[0] = r / 255;
  vec[1] = g / 255;
  vec[2] = b / 255;
  return vec;
}

export function vecToString(vec) {
  let r = leftPad((vec[0] * 255 | 0).toString(16), 2, '0');
  let g = leftPad((vec[1] * 255 | 0).toString(16), 2, '0');
  let b = leftPad((vec[2] * 255 | 0).toString(16), 2, '0');
  return '#' + r + g + b;
}
