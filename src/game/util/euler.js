import { mat3 as Mat3, quat as Quat } from 'gl-matrix';

const MAT3_BUFFER = Mat3.create();

export function quatToEuler(quat) {
  let mat = Mat3.fromQuat(MAT3_BUFFER, quat);
  let x, y, z;
  z = Math.asin(Math.min(1, Math.max(-1, mat[1])));
  if (Math.abs(mat[1]) < 0.99999) {
    x = Math.atan2(-mat[7], mat[4]);
    y = Math.atan2(-mat[2], mat[0]);
  } else {
    x = 0;
    y = Math.atan2(mat[6], mat[8]);
  }
  return new Float32Array([x, y, z]);
}
export function eulerToQuat(euler) {
  let quat = Quat.create();
  Quat.rotateY(quat, quat, euler[1]);
  Quat.rotateZ(quat, quat, euler[2]);
  Quat.rotateX(quat, quat, euler[0]);
  return quat;
}
export function toDegree(radian) {
  return radian / Math.PI * 180;
}
export function toRadian(degree) {
  return degree / 180 * Math.PI;
}
