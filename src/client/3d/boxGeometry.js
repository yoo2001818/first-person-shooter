import { vec2, vec3 } from 'gl-matrix';
import Geometry from './geometry';

export default class BoxGeometry extends Geometry {
  constructor(context) {
    super(context);
    this.vertices = BoxGeometry.VERTICES;
    this.normals = BoxGeometry.NORMALS;
    this.texCoords = BoxGeometry.TEXCOORDS;
    this.tangents = BoxGeometry.TANGENTS;
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

// Then calculate tangent map.
BoxGeometry.TANGENTS = new Float32Array(3 * 4 * 6);
for (let i = 0; i < 6; ++i) {
  let o = BoxGeometry.VERTICES.slice(i * 12, i * 12 + 3);
  let edge1 = vec3.create();
  let edge2 = vec3.create();
  vec3.subtract(edge1, BoxGeometry.VERTICES.slice(i * 12 + 3, i * 12 + 6), o);
  vec3.subtract(edge2, BoxGeometry.VERTICES.slice(i * 12 + 6, i * 12 + 9), o);
  let t = BoxGeometry.TEXCOORDS.slice(i * 8, i * 8 + 2);
  let uv1 = vec3.create();
  let uv2 = vec3.create();
  vec2.subtract(uv1, BoxGeometry.TEXCOORDS.slice(i * 8 + 2, i * 8 + 4), t);
  vec2.subtract(uv2, BoxGeometry.TEXCOORDS.slice(i * 8 + 4, i * 8 + 6), t);
  let f = 1 / (uv1[0] * uv2[1] - uv2[0] * uv1[1]);
  let tangent = vec3.create();
  tangent[0] = f * (uv2[1] * edge1[0] - uv1[1] * edge2[0]);
  tangent[1] = f * (uv2[1] * edge1[1] - uv1[1] * edge2[1]);
  tangent[2] = f * (uv2[1] * edge1[2] - uv1[1] * edge2[2]);
  for (let j = 0; j < 4; ++j) {
    BoxGeometry.TANGENTS.set(tangent, i * 12 + j * 3);
  }
}
