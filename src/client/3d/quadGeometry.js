import { vec3 } from 'gl-matrix';
import Geometry from './geometry';

export default class QuadGeometry extends Geometry {
  constructor(context) {
    super(context);
    this.vertices = QuadGeometry.VERTICES;
    this.normals = QuadGeometry.NORMALS;
    this.texCoords = QuadGeometry.TEXCOORDS;
    this.indices = QuadGeometry.INDICES;
  }
}

/* eslint-disable indent */

QuadGeometry.VERTICES = new Float32Array([
  // Front
  -1.0, -1.0,  0.0,
   1.0, -1.0,  0.0,
   1.0,  1.0,  0.0,
  -1.0,  1.0,  0.0,
  // Back
   1.0, -1.0,  0.0,
  -1.0, -1.0,  0.0,
  -1.0,  1.0,  0.0,
   1.0,  1.0,  0.0
]);

QuadGeometry.INDICES = new Uint16Array([
   0,  1,  2,  2,  3,  0,
   4,  5,  6,  6,  7,  4
]);

/* eslint-enable indent */

QuadGeometry.TEXCOORDS = new Float32Array(2 * 4 * 2);
// Generate texture coords on the fly, because why not?
QuadGeometry.TEXCOORDS.set([ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 ], 0);
for (let i = 0; i < 2; ++i) {
  QuadGeometry.TEXCOORDS.copyWithin(i * 2 * 4, 0, 2 * 4);
}

// Generate normal map, too.
QuadGeometry.NORMALS = new Float32Array(3 * 4 * 2);
for (let i = 0; i < 2; ++i) {
  let o = QuadGeometry.VERTICES.slice(i * 12, i * 12 + 3);
  let p1 = vec3.create();
  let p2 = vec3.create();
  let uv = vec3.create();
  vec3.subtract(p1, QuadGeometry.VERTICES.slice(i * 12 + 3, i * 12 + 6), o);
  vec3.subtract(p2, QuadGeometry.VERTICES.slice(i * 12 + 6, i * 12 + 9), o);
  vec3.cross(uv, p1, p2);
  for (let j = 0; j < 4; ++j) {
    QuadGeometry.NORMALS.set(uv, i * 12 + j * 3);
  }
}
