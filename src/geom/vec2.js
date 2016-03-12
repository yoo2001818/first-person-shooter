// 2D vector, (almost) copied from three.js

export default class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  copy(target) {
    this.x = target.x;
    this.y = target.y;
    return this;
  }
  add(target) {
    this.x += target.x;
    this.y += target.y;
    return this;
  }
  addScalar(s) {
    this.x += s;
    this.y += s;
    return this;
  }
  subtract(target) {
    this.x -= target.x;
    this.y -= target.y;
    return this;
  }
  multiplyScalar(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }
  divideScalar(value) {
    this.x /= value;
    this.y /= value;
    return this;
  }
  invert() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  dot(target) {
    return this.x * target.x + this.y * target.y;
  }
  lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.lengthSquared());
  }
  normalize() {
    return this.divide(this.length());
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  distanceSquared(target) {
    let diffX = this.x - target.x;
    let diffY = this.y - target.y;
    return diffX * diffX + diffY * diffY;
  }
  distance(target) {
    return Math.sqrt(this.distanceSquared(target));
  }
  setLength(l) {
    return this.multiply(l / this.length());
  }
  equals(target) {
    return this.x === target.x && this.y === target.y;
  }
  clone() {
    return new Vec2(this.x, this.y);
  }
  clamp(min, max) {
    if (this.x < min.x) this.x = min.x;
    if (this.y < min.y) this.y = min.y;
    if (this.x > max.x) this.x = max.x;
    if (this.x > max.y) this.x = max.y;
    return this;
  }
  clampScalar(min, max) {
    if (this.x < min) this.x = min;
    if (this.y < min) this.y = min;
    if (this.x > max) this.x = max;
    if (this.x > max) this.x = max;
    return this;
  }
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  lerp(target, alpha) {
    return this.lerpVectors(this, target, alpha);
  }
  lerpVectors(v1, v2, alpha) {
    let diffX = v2.x - v1.x;
    let diffY = v2.y - v1.y;
    this.x = v1.x + diffX * alpha;
    this.y = v1.y + diffY * alpha;
    return this;
  }
  min(min) {
    if (this.x < min.x) this.x = min.x;
    if (this.y < min.y) this.y = min.y;
    return this;
  }
  max(max) {
    if (this.x > max) this.x = max;
    if (this.x > max) this.x = max;
    return this;
  }
}
