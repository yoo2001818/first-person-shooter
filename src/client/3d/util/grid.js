import GridMaterial from '../material/gridMaterial';
import Object3D from '../object3D';

import { mat4 } from 'gl-matrix';

export default class Grid extends Object3D {
  // Currently, Grid doesn't use Mesh or Geometry - but it should!
  // To implement Grid using Mesh and Geometry, we must implement
  // line drawing and instancing and custom attributes.
  constructor(gl, width = 10, height = 10, gap = 1.0) {
    super();
    // Construct vertices data
    this.vertices = new Float32Array(4 * (width + height));
    let minX = -(width - 1) / 2 * gap;
    let minY = -(height - 1) / 2 * gap;
    let maxX = (width - 1) / 2 * gap;
    let maxY = (height - 1) / 2 * gap;
    let pos = 0;
    for (let y = 0; y < height; ++y) {
      let offsetY = (y - (height - 1) / 2) * gap;
      this.vertices[pos++] = minX;
      this.vertices[pos++] = offsetY;
      this.vertices[pos++] = maxX;
      this.vertices[pos++] = offsetY;
    }
    for (let x = 0; x < width; ++x) {
      let offsetX = (x - (width - 1) / 2) * gap;
      this.vertices[pos++] = offsetX;
      this.vertices[pos++] = minY;
      this.vertices[pos++] = offsetX;
      this.vertices[pos++] = maxY;
    }
    this.gl = gl;
    // Upload vertices data to the GPU
    this.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Add material
    this.material = new GridMaterial(gl,
      new Float32Array([74 / 255, 74 / 255, 74 / 255]),
      new Float32Array([132 / 255, 22 / 255, 22 / 255]),
      new Float32Array([22 / 255, 22 / 255, 132 / 255])
    );
  }
  render(context) {
    const { gl } = context;
    this.material.use(null, context);

    gl.enableVertexAttribArray(this.material.shader.vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.vertexAttribPointer(this.material.shader.vertices,
      2, gl.FLOAT, false, 8, 0);

    // TODO maybe multiplying in the shader is faster? Or not.
    let mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, context.vpMatrix, this.globalMatrix);
    gl.uniformMatrix4fv(this.material.shader.transform, false,
      mvpMatrix);

    gl.drawArrays(gl.LINES, 0, this.vertices.length / 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
