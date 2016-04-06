import { mat4 } from 'gl-matrix';

export default class Object3D {
  constructor() {
    // We need more than this. But this should be enough for now..
    this.matrix = mat4.create();
  }
  getGlobalMatrix(parentMat) {
    let matrix = mat4.create();
    mat4.multiply(matrix, parentMat, this.matrix);
    return matrix;
  }
  render() {
    // Do nothing
  }
}
