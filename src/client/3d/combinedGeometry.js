import Geometry from './geometry';
import { vec3 } from 'gl-matrix';
export default class CombinedGeometry extends Geometry {
  constructor(context) {
    super(context);
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.tangents = [];
    this.indices = [];
  }
  joinArray(orig, dest) {
    for (let i = 0; i < dest.length; ++i) {
      orig.push(dest[i]);
    }
  }
  combine(geometry, matrix) {
    for (let i = 0; i < geometry.indices.length; ++i) {
      this.indices.push(geometry.indices[i] + this.getVertexCount());
    }
    // Apply matrix operations to the geometry
    for (let i = 0; i < geometry.getVertexCount(); ++i) {
      let vertex = vec3.create();
      vec3.transformMat4(vertex, geometry.vertices.slice(i*3, i*3 + 3), matrix);
      this.vertices.push(vertex[0], vertex[1], vertex[2]);
    }
    this.joinArray(this.normals, geometry.normals);
    this.joinArray(this.texCoords, geometry.texCoords);
    this.joinArray(this.tangents, geometry.tangents);
  }
  load() {
    this.vertices = new Float32Array(this.vertices);
    this.normals = new Float32Array(this.normals);
    this.texCoords = new Float32Array(this.texCoords);
    this.tangents = new Float32Array(this.tangents);
    this.indices = new Uint16Array(this.indices);
    return super.load();
  }
}
