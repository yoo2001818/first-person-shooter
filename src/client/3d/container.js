import Object3D from './object3D';

export default class Container extends Object3D {
  constructor() {
    super();
    this.children = [];
  }
  appendChild(child) {
    this.children.push(child);
  }
  getChildIndex(child) {
    return this.children.indexOf(child);
  }
  removeChild(child) {
    this.children.splice(this.getChildIndex(child), 1);
  }
  render(gl, transform, context) {
    let matrix = this.getGlobalMatrix(transform);
    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i];
      child.render(gl, matrix, context);
    }
  }
}
