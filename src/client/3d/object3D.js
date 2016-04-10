import { mat4, vec3 } from 'gl-matrix';

export default class Object3D {
  constructor() {
    // We need more than this. But this should be enough for now..
    this.matrix = mat4.create();
    // Currently position vector and matrix are not synchronized;
    // While it's easy to map matrix to position - and vice versa,
    // we still have to figure a way to do it without too much complexity.
    this.position = vec3.create();
    // Global view matrix. I have no idea why I'm supporting hierarchy though.
    this.globalMatrix = mat4.create();
  }
  // Update function updates the uniform information, etc... to pass to the
  // render function.
  update(context, parent) {
    // Update global matrix
    if (parent) {
      mat4.multiply(this.globalMatrix, parent.matrix, this.matrix);
    } else {
      // Assume identity matrix if no parent is given
      mat4.copy(this.globalMatrix, this.matrix);
    }
  }
  // Render function actually renders the context to WebGL.
  render() {
    // Do nothing
  }
}
