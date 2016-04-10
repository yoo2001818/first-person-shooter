import Object3D from './object3D';
import { mat3, mat4 } from 'gl-matrix';

export default class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
  // Currently do nothing at update, but we may need it for instancing, etc...
  render(context) {
    const { gl } = context;
    this.material.use(this.geometry, context);
    // TODO maybe multiplying in the shader is faster? Or not.
    let mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, context.vpMatrix, this.globalMatrix);
    gl.uniformMatrix4fv(this.material.shader.transform, false,
      mvpMatrix);
    gl.uniformMatrix4fv(this.material.shader.model, false,
      this.globalMatrix);
    if (this.material.shader.modelInvTransp !== -1) {
      let invMat = mat3.create();
      mat3.normalFromMat4(invMat, this.globalMatrix);
      gl.uniformMatrix3fv(this.material.shader.modelInvTransp, false,
        invMat);
    }
    this.geometry.draw();
    this.geometry.cleanUp();
  }
}
