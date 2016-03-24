import * as engineActions from '../action/engine';
import * as posChanges from '../change/pos';
//import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import { Rect, Vector } from 'kollision';
import * as GeometryType from '../util/geometryType';

// Pre-built array for allocation

let buffer1 = new Float32Array(4);
let buffer2 = new Float32Array(4);
let vec1 = new Float32Array(2);
let vec2 = new Float32Array(2);
let vec3 = new Float32Array(2);

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

function lineRect(line, rect, store) {
  let lineGeom = buildGeom(line.pos, buffer1);
  let rectGeom = buildGeom(rect.pos, buffer2);
  if (!Rect.intersectsLine(rectGeom, lineGeom, vec1, vec2, vec3)) return;
  //console.log(inspectVec(vec1), inspectVec(vec2), inspectVec(vec3));
  addDebugSymbol(vec1, store);
  // addDebugSymbol(Vector.add(vec1, vec2, vec3), store);
  if (vec3[1] == 1) vec2[0] = -vec2[0];
  if (vec3[0] == 1) vec2[1] = -vec2[1];
  Vector.multiply(vec2, 0.5, vec2);
  store.changes.push(posChanges.translate(rect, vec2, true));
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
          lineRect(bigger ? entity : target, bigger ? target : entity, store);
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
