import Object3D from './object3D';
import { vec3 } from 'gl-matrix';

export default class Light extends Object3D {
  constructor(options) {
    super();
    this.options = options;
    this.rotation = vec3.create();
  }
  update(context, parent) {
    super.update(context, parent);
    let position = new Float32Array(4);
    position[0] = this.position[0];
    position[1] = this.position[1];
    position[2] = this.position[2];
    position[3] = this.position[3] == null ? 1 : this.position[3];
    context.lights.push(Object.assign({}, this.options, {
      position, coneDirection: this.rotation
    }));
  }
}
