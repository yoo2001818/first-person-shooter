import Object3D from './object3D';

export default class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
  render(gl, transform) {
    this.material.use(this.geometry);
    gl.uniformMatrix4fv(this.material.shader.transform, false,
      this.getGlobalMatrix(transform));
    this.geometry.draw();
  }
}
