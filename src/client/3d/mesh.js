import Object3D from './object3D';
import { mat3 } from 'gl-matrix';

export default class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
  render(gl, transform, context) {
    this.material.use(this.geometry, context);
    gl.uniformMatrix4fv(this.material.shader.transform, false,
      this.getGlobalMatrix(transform));
    gl.uniformMatrix4fv(this.material.shader.model, false,
      this.matrix);
    if (this.material.shader.modelInvTransp !== -1) {
      let invMat = mat3.create();
      mat3.normalFromMat4(invMat, this.matrix);
      gl.uniformMatrix3fv(this.material.shader.modelInvTransp, false,
        invMat);
    }
    this.geometry.draw();
  }
}
