// 2D axis aligned bounding box
export default class Box2 {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  add(target) {
    this.x += target.x;
    this.y += target.y;
  }
  

}
