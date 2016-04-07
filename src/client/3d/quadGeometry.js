import { vec2, vec3 } from 'gl-matrix';
import Geometry from './geometry';

export default class QuadGeometry extends Geometry {
  constructor(context) {
    super(context);
    this.vertices = QuadGeometry.VERTICES;
    this.normals = QuadGeometry.NORMALS;
    this.texCoords = QuadGeometry.TEXCOORDS;
    this.tangents = QuadGeometry.TANGENTS;
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
// Then calculate tangent map.
QuadGeometry.TANGENTS = new Float32Array(3 * 4 * 2);
for (let i = 0; i < 2; ++i) {
  let o = QuadGeometry.VERTICES.slice(i * 12, i * 12 + 3);
  let edge1 = vec3.create();
  let edge2 = vec3.create();
  vec3.subtract(edge1, QuadGeometry.VERTICES.slice(i * 12 + 3, i * 12 + 6), o);
  vec3.subtract(edge2, QuadGeometry.VERTICES.slice(i * 12 + 6, i * 12 + 9), o);
  let t = QuadGeometry.TEXCOORDS.slice(i * 8, i * 8 + 2);
  let uv1 = vec3.create();
  let uv2 = vec3.create();
  vec2.subtract(uv1, QuadGeometry.TEXCOORDS.slice(i * 8 + 2, i * 8 + 4), t);
  vec2.subtract(uv2, QuadGeometry.TEXCOORDS.slice(i * 8 + 4, i * 8 + 6), t);
  let f = 1 / (uv1[0] * uv2[1] - uv2[0] * uv1[1]);
  let tangent = vec3.create();
  tangent[0] = f * (uv2[1] * edge1[0] - uv1[1] * edge2[0]);
  tangent[1] = f * (uv2[1] * edge1[1] - uv1[1] * edge2[1]);
  tangent[2] = f * (uv2[1] * edge1[2] - uv1[1] * edge2[2]);
  for (let j = 0; j < 4; ++j) {
    QuadGeometry.TANGENTS.set(tangent, i * 8 + j * 2);
  }
}
