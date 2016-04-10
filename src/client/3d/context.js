// A rendering context - used for rendering.
export default class Context {
  constructor(context) {
    this.lights = [];
    this.viewPos = new Float32Array(3);
    this.vpMatrix = new Float32Array(4);
    this.gl = context;
  }
  reset() {
    this.lights = [];
  }
}
