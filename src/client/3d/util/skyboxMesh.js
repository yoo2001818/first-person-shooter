import Mesh from '../mesh';
import { mat4 } from 'gl-matrix';

export default class SkyboxMesh extends Mesh {
  render(context) {
    const { gl } = context;
    this.material.use(this.geometry, context);
    let mvMatrix = mat4.create();
    // Drop translation info from the view matrix
    let vMatrix = mat4.create();
    mat4.copy(vMatrix, context.vMatrix);
    vMatrix[3] = 0;
    vMatrix[7] = 0;
    vMatrix[11] = 0;
    vMatrix[12] = 0;
    vMatrix[13] = 0;
    vMatrix[14] = 0;
    vMatrix[15] = 1;
    mat4.multiply(mvMatrix, context.pMatrix, vMatrix);
    gl.uniformMatrix4fv(this.material.shader.transform, false,
      mvMatrix);
    this.geometry.draw();
    this.geometry.cleanUp();
  }
}
