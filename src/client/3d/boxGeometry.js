import { vec3 } from 'gl-matrix';
import Geometry from './geometry';

export default class BoxGeometry extends Geometry {
  constructor(context) {
    super(context);
    this.vertices = BoxGeometry.VERTICES;
    this.normals = BoxGeometry.NORMALS;
    this.texCoords = BoxGeometry.TEXCOORDS;
    this.indices = BoxGeometry.INDICES;
  }
}

/* eslint-disable indent */

BoxGeometry.VERTICES = new Float32Array([
  // Front
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  // Top
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,
  -1.0,  1.0, -1.0,
  // Back
   1.0, -1.0, -1.0,
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
  // Bottom
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,
  // Left
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
  // Right
   1.0, -1.0,  1.0,
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0
]);

BoxGeometry.INDICES = new Uint16Array([
   0,  1,  2,  2,  3,  0,
   4,  5,  6,  6,  7,  4,
   8,  9, 10, 10, 11,  8,
  12, 13, 14, 14, 15, 12,
  16, 17, 18, 18, 19, 16,
  20, 21, 22, 22, 23, 20
]);

/* eslint-enable indent */

BoxGeometry.TEXCOORDS = new Float32Array(2 * 4 * 6);
// Generate texture coords on the fly, because why not?
BoxGeometry.TEXCOORDS.set([ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 ], 0);
for (let i = 0; i < 6; ++i) {
  BoxGeometry.TEXCOORDS.copyWithin(i * 2 * 4, 0, 2 * 4);
}

// Generate normal map, too.
BoxGeometry.NORMALS = new Float32Array(3 * 4 * 6);
for (let i = 0; i < 6; ++i) {
  let o = BoxGeometry.VERTICES.slice(i * 12, i * 12 + 3);
  let p1 = vec3.create();
  let p2 = vec3.create();
  let uv = vec3.create();
  vec3.subtract(p1, BoxGeometry.VERTICES.slice(i * 12 + 3, i * 12 + 6), o);
  vec3.subtract(p2, BoxGeometry.VERTICES.slice(i * 12 + 6, i * 12 + 9), o);
  vec3.cross(uv, p1, p2);
  for (let j = 0; j < 4; ++j) {
    BoxGeometry.NORMALS.set(uv, i * 12 + j * 3);
  }
}
