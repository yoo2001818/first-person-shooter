import Geometry from '../geometry';
import { vec2, vec3 } from 'gl-matrix';

function applyVec3(dest, orig, pos) {
  dest[pos] = orig[0];
  dest[pos + 1] = orig[1];
  dest[pos + 2] = orig[2];
}

function load(gl, data) {
  let vertices = [];
  let textures = [];
  let normals = [];

  let index = 0;
  let vertexCombinations = {};

  let outVertices = [];
  let outTextures = [];
  let outNormals = [];
  let outTangents = [];
  let outIndices = [];

  data.split(/[\r\n]/).forEach(line => {
    if (line.charAt(0) === '#') return;
    let args = line.split(' ');
    switch (args[0]) {
    case 'v':
      vertices.push(args.slice(1).map(parseFloat));
      break;
    case 'vt':
      textures.push(args.slice(1).map(parseFloat));
      break;
    case 'vn':
      normals.push(args.slice(1).map(parseFloat));
      break;
    case 'f': {
      let needCalc = false;
      let normalInfo = true;
      let textureInfo = true;
      args.slice(1).forEach(data => {
        let vertexInfo = data.split('/');
        if (vertexCombinations[data] == null) {
          let vertexId = parseInt(vertexInfo[0]);
          outVertices.push(vertices[vertexId - 1][0],
            vertices[vertexId - 1][1],
            vertices[vertexId - 1][2]);
          let textureId = parseInt(vertexInfo[1]);
          if (textureId) {
            outTextures.push(textures[textureId - 1][0],
              textures[textureId - 1][1]);
          } else {
            outTextures.push(0, 0);
            textureInfo = false;
          }
          let normalId = parseInt(vertexInfo[2]);
          if (normalId) {
            outNormals.push(normals[normalId - 1][0],
              normals[normalId - 1][1],
              normals[normalId - 1][2]);
          } else {
            outNormals.push(0, 0, 0);
            normalInfo = false;
          }
          // Fill tangents to 1, 1, 1 at the first time
          outTangents.push(1, 1, 1);
          outIndices.push(index);
          vertexCombinations[data] = index;
          index ++;
          needCalc = true;
        } else {
          outIndices.push(vertexCombinations[data]);
        }
      });
      let faceA = outIndices[outIndices.length - 3];
      let faceB = outIndices[outIndices.length - 2];
      let faceC = outIndices[outIndices.length - 1];
      if (!needCalc) break;
      // Calculate normals (however obj file should provide it)
      if (!normalInfo) {
        let o = outVertices.slice(faceA * 3, faceA * 3 + 3);
        let p1 = vec3.create();
        let p2 = vec3.create();
        let uv = vec3.create();
        vec3.subtract(p1, outVertices.slice(faceB * 3, faceB * 3 + 3), o);
        vec3.subtract(p2, outVertices.slice(faceC * 3, faceC * 3 + 3), o);
        vec3.cross(uv, p1, p2);

        applyVec3(outNormals, uv, faceA * 3);
        applyVec3(outNormals, uv, faceB * 3);
        applyVec3(outNormals, uv, faceC * 3);
      }
      // Calculate tangents
      if (textureInfo) {
        let o = outVertices.slice(faceA * 3, faceA * 3 + 3);
        let edge1 = vec3.create();
        let edge2 = vec3.create();
        vec3.subtract(edge1, outVertices.slice(faceB * 3, faceB * 3 + 3), o);
        vec3.subtract(edge2, outVertices.slice(faceC * 3, faceC * 3 + 3), o);
        let t = outTextures.slice(faceA * 2, faceA * 2 + 2);
        let uv1 = vec3.create();
        let uv2 = vec3.create();
        vec2.subtract(uv1, outTextures.slice(faceB * 2, faceB * 2 + 2), t);
        vec2.subtract(uv2, outTextures.slice(faceC * 2, faceC * 2 + 2), t);
        let f = 1 / (uv1[0] * uv2[1] - uv2[0] * uv1[1]);
        let tangent = vec3.create();
        tangent[0] = f * (uv2[1] * edge1[0] - uv1[1] * edge2[0]);
        tangent[1] = f * (uv2[1] * edge1[1] - uv1[1] * edge2[1]);
        tangent[2] = f * (uv2[1] * edge1[2] - uv1[1] * edge2[2]);
        applyVec3(outTangents, tangent, faceA * 3);
        applyVec3(outTangents, tangent, faceB * 3);
        applyVec3(outTangents, tangent, faceC * 3);
      } else {
        let n = outNormals.slice(faceA * 3, faceA * 3 + 3);
        let t;
        let edge1 = vec3.create();
        let edge2 = vec3.create();
        vec3.cross(edge1, n, [0, 0, 1]);
        vec3.cross(edge2, n, [0, 0, 1]);
        if (vec3.length(edge1) > vec3.length(edge2)) {
          t = edge1;
        } else {
          t = edge2;
        }
        vec3.normalize(t, t);
        applyVec3(outTangents, t, faceA * 3);
        applyVec3(outTangents, t, faceB * 3);
        applyVec3(outTangents, t, faceC * 3);
      }
      break;
    }
    }
  });
  console.log(outTangents);
  // After everything is done, create geometry and apply
  let geometry = new Geometry(gl);
  geometry.vertices = new Float32Array(outVertices);
  geometry.normals = new Float32Array(outNormals);
  geometry.texCoords = new Float32Array(outTextures);
  geometry.tangents = new Float32Array(outTangents);
  geometry.indices = new Uint16Array(outIndices);

  return geometry;
}

export default {
  load
};
