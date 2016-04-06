import { vec3 } from 'gl-matrix';
import Geometry from './geometry';

export default class BoxGeometry extends Geometry {
  constructor(context) {
    super(context);
    this.vertices = BoxGeometry.VERTICES;
    this.normals = BoxGeometry.NORMALS;
    this.texCoords = BoxGeometry.TEXCOORDS;
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

/* eslint-enable indent */

BoxGeometry.TEXCOORDS = new Float32Array(2 * 4 * 6);
// Generate texture coords on the fly, because why not?
BoxGeometry.TEXCOORDS.set([ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 ], 0);
for (let i = 0; i < 6; ++i) {
  BoxGeometry.TEXCOORDS.copyWithin(0, i * 2 * 4, 2 * 4);
}

// Generate UV map, too.
BoxGeometry.UVS = new Float32Array(3 * 4 * 6);
for (let i = 0; i < 6; ++i) {
  let uv = vec3.create();
  vec3.cross(uv,
    BoxGeometry.VERTICES.slice(i * 12, i * 12 + 4),
    BoxGeometry.VERTICES.slice(i * 12 + 4, i * 12 + 8)
  );
  for (let j = 0; j < 4; ++j) {
    BoxGeometry.UVS.set(uv, i * j * 3);
  }
}
