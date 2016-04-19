import BoxGeometry from './boxGeometry';

export default class SkyboxGeometry extends BoxGeometry {
  constructor(context) {
    super(context);
    this.indices = new Uint16Array(this.indices);
    // Flip indices...
    for (let i = 0; i < 12; ++i) {
      let tmp = this.indices[i * 3 + 1];
      this.indices[i * 3 + 1] = this.indices[i * 3 + 2];
      this.indices[i * 3 + 2] = tmp;
    }
  }
}
