export default class Material {
  constructor(context, shader) {
    this.gl = context;
    this.shader = shader;
  }
  use(geometry) {
    this.shader.use();
    geometry.use(this.shader);
    // Child classes will set the uniforms, etc.
  }
}
