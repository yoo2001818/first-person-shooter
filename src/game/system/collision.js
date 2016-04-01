import * as engineActions from '../action/engine';
import * as posChanges from '../change/pos';
import * as velChanges from '../change/vel';
//import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import { Rect, Vector } from 'kollision';
import * as GeometryType from '../util/geometryType';

// Pre-built array for allocation

let buffer1 = new Float32Array(4);
let buffer2 = new Float32Array(4);
let vec1 = new Float32Array(2);
let vec2 = new Float32Array(2);
let vec3 = new Float32Array(2);
let vec4 = new Float32Array(2);
let vec5 = new Float32Array(2);
let vec6 = new Float32Array(2);

function inspectVec(vec) {
  return `(${vec[0].toFixed(2)}, ${vec[1].toFixed(2)})`;
}

// Build geometry object from pos object
function buildGeom(data, dest) {
  dest[0] = data.translate[0] - data.scale[0];
  dest[1] = data.translate[1] - data.scale[1];
  dest[2] = data.translate[0] + data.scale[0];
  dest[3] = data.translate[1] + data.scale[1];
  return dest;
}

// TODO Test code, should be refactored
function addDebugSymbol(vec, store) {
  if (store.state.globals.debug == null) store.state.globals.debug = [];
  store.state.globals.debug.push({
    x: vec[0], y: vec[1]
  });
}

function addDebugLine(vec, vec2, store) {
  store.state.globals.debug.push({
    vector: true,
    x: vec[0], y: vec[1],
    vx: vec2[0] - vec[0], vy: vec2[1] - vec[1]
  });
}

function lineRect(line, rect, store) {
  let lineGeom = buildGeom(line.pos, buffer1);
  let rectGeom = buildGeom(rect.pos, buffer2);
  if (!Rect.intersectsLine(rectGeom, lineGeom, vec1, vec2, vec3, vec4)) {
    return false;
  }
  // console.log(inspectVec(vec1), inspectVec(vec2), inspectVec(vec3));
  addDebugSymbol(vec1, store);
  addDebugSymbol(Vector.add(vec1, vec2, vec5), store);
  store.state.globals.debug.push({
    rect: true,
    x: rectGeom[0], y: rectGeom[1],
    vx: rectGeom[2] - rectGeom[0], vy: rectGeom[3] - rectGeom[1]
  });
  // Collision reaction calculation comes in here
  if (Vector.cross(vec3, vec4) != 0) {
    // Scenario 1: Two collided edges are perpendicular to each other
    vec2[0] = -0.5 * (vec3[0] + vec4[0]) * Math.abs(vec2[0]);
    vec2[1] = -0.5 * (vec3[1] + vec4[1]) * Math.abs(vec2[1]);
  } else if (Vector.dot(vec3, vec4) !== 0 ||
    Vector.lengthTaxi(vec2) * 3 >
    Math.max(Rect.width(rectGeom), Rect.height(rectGeom))
  ) {
    // Scenario 2: Two collided edges are parallel to each other
    // Select two vertexs that doesn't 'meet' with the line
    let deltaDir = vec2[0] * vec2[1];
    let deltaVert = vec2[0] < vec2[1];
    vec5[0] = (deltaDir > 0) ? rectGeom[2] : rectGeom[0];
    vec5[1] = rectGeom[1];
    vec6[0] = (deltaDir > 0) ? rectGeom[0] : rectGeom[2];
    vec6[1] = rectGeom[3];
    addDebugSymbol(vec5, store);
    addDebugSymbol(vec6, store);
    // Then calculate distance of each other from the delta center
    Vector.add(vec2, vec1, vec2);
    addDebugLine(vec5, vec1, store);
    addDebugLine(vec6, vec2, store);
    let l1 = Vector.distanceSquared(vec5, vec1);
    let l2 = Vector.distanceSquared(vec6, vec2);
    if (l1 < l2) {
      Vector.subtract(vec1, vec5, vec2);
    } else {
      Vector.subtract(vec2, vec6, vec2);
    }
  } else {
    // Scenario 3: Only one edge collides
    // Check if line start doesn't collides, flip it if it does
    if (vec3[0] === 0 && vec3[1] === 0) {
      Vector.multiply(vec2, -1, vec2);
    }
  }
  store.changes.unshift(posChanges.translate(rect, vec2, true));
  if (rect.vel) {
    // Vector.multiply(vec2, 0.5, vec2);
    // store.changes.push(velChanges.add(rect, vec2));
  }
  /*
  // Render normal vectors, though this looks awkward
  lineGeom[0] = rectGeom[(vec3[0] === 0) ? 0 : (1 + vec3[0])];
  lineGeom[2] = rectGeom[(vec3[0] === 0) ? 2 : (1 + vec3[0])];
  lineGeom[1] = rectGeom[(vec3[1] === 0) ? 1 : (2 + vec3[1])];
  lineGeom[3] = rectGeom[(vec3[1] === 0) ? 3 : (2 + vec3[1])];
  store.state.globals.debug.push({
    vector: true,
    x: lineGeom[0], y: lineGeom[1],
    vx: lineGeom[2] - lineGeom[0], vy: lineGeom[3] - lineGeom[1]
  });
  lineGeom[0] = rectGeom[(vec4[0] === 0) ? 0 : (1 + vec4[0])];
  lineGeom[2] = rectGeom[(vec4[0] === 0) ? 2 : (1 + vec4[0])];
  lineGeom[1] = rectGeom[(vec4[1] === 0) ? 1 : (2 + vec4[1])];
  lineGeom[3] = rectGeom[(vec4[1] === 0) ? 3 : (2 + vec4[1])];
  store.state.globals.debug.push({
    vector: true,
    x: lineGeom[0], y: lineGeom[1],
    vx: lineGeom[2] - lineGeom[0], vy: lineGeom[3] - lineGeom[1]
  });*/
  return true;
}

export default class CollisionSystem {
  onMount(store) {
    this.store = store;
    this.entities = store.systems.family.get(['collision', 'pos']).entities;
    store.actions.on(engineActions.UPDATE, () => {
      this.store.state.globals.debug = [];
    });
    store.changes.on(posChanges.TRANSLATE, event => {
      if (event.data.collision) return;
      const { entity } = event.data;
      for (let i = 0; i < this.entities.length; ++i) {
        let target = this.entities[i];
        if (entity === target) continue;
        let collisionType = entity.pos.type + target.pos.type;
        let bigger = entity.pos.type > target.pos.type;
        // Type check...
        switch (collisionType) {
        case GeometryType.RECT | GeometryType.LINE:
          if (lineRect(bigger ? entity : target, bigger ? target : entity,
            store)) return;
          break;
        }
      }
    });
    /*
    store.actions.on(engineActions.UPDATE, () => {
      // TODO Debug code; should be removed
      this.store.state.globals.debug = [];
      for (let i = 0; i < this.entities.length; ++i) {
        let entity = this.entities[i];
        for (let j = 0; j < i; ++j) {
          let target = this.entities[j];
          let collisionType = entity.pos.type + target.pos.type;
          let bigger = entity.pos.type > target.pos.type;
          // Type check...
          switch (collisionType) {
          case GeometryType.RECT | GeometryType.LINE:
            lineRect(bigger ? entity : target, bigger ? target : entity, store);
            break;
          }
        }
      }
    });
    */
  }
}
