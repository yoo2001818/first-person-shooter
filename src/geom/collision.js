export function cross(x1, y1, x2, y2) {
  return x1 * y2 - y1 * x2;
}

export function dot(x1, y1, x2, y2) {
  return x1 * x2 + y1 * y2;
}

export function line(x1, y1, x2, y2, x3, y3, x4, y4) {
  let x12 = x2 - x1;
  let y12 = y2 - y1;
  let x34 = x4 - x3;
  let y34 = y4 - y3;
  let div = (-x34 * y12 + x12 * y34);
  let s = (-y12 * (x1 - x3) + x12 * (y1 - y3)) / div;
  let t = (x34 * (y1 - y3) - y34 * (x1 - x3)) / div;
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    let x = x1 + (t * x12);
    let y = y1 + (t * y12);
    return { x, y };
  }
  return null;
}

// 1, 2 - line, 3, 4 - rect
export function lineRect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let edgeU = line(x1, y1, x2, y2, x3, y3, x4, y3);
  let edgeL = line(x1, y1, x2, y2, x3, y3, x3, y4);
  let edgeD = line(x1, y1, x2, y2, x3, y4, x4, y4);
  let edgeR = line(x1, y1, x2, y2, x4, y3, x4, y4);
  if (!edgeU && !edgeL && !edgeD && !edgeR) return null;
  return [edgeU, edgeL, edgeD, edgeR];
}
