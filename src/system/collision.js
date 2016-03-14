import * as engineActions from '../action/engine';
import * as PosChanges from '../change/pos';
// import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as Collision from '../geom/collision';
/*
function getVertexX(x1, x2, id) {
  return id < 2 ? x1 : x2;
}

function getVertexY(y1, y2, id) {
  return id === 0 || id === 3 ? y1 : y2;
}
*/
function handleLineRect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let points = Collision.lineRect(x1, y1, x2, y2, x3, y3, x4, y4);
  if (!points) return null;
  // 2 intersections test
  for (let i = 0; i < 3; ++i) {
    let p1 = points[i];
    let p2 = points[(i + 1) % 4];
    if (p1 && p2) {
      return {
        x: i % 2 ? p2.x - p1.x : p1.x - p2.x,
        y: i % 2 ? p1.y - p2.y : p2.y - p1.y
      };
    }
  }
  // 3 intersections test... Currently not done
  /*
  for (let i = 0; i < 2; ++i) {
    if (points[i] && points[i + 2]) {

    }
  }*/
  return null;
}

function handleLineRect2(line, rect, store) {
  let x1 = line.pos.x - line.geom.width / 2;
  let x2 = line.pos.x + line.geom.width / 2;
  let x3 = rect.pos.x - rect.geom.width / 2;
  let x4 = rect.pos.x + rect.geom.width / 2;
  let y1 = line.pos.y - line.geom.height / 2;
  let y2 = line.pos.y + line.geom.height / 2;
  let y3 = rect.pos.y - rect.geom.height / 2;
  let y4 = rect.pos.y + rect.geom.height / 2;
  let result = handleLineRect(x1, y1, x2, y2, x3, y3, x4, y4);
  if (!result) return;
  if (result.x === 0 && result.y === 0) return;
  store.changes.push(PosChanges.add(rect, result.x / 2, result.y / 2));
}

export default class CollisionSystem {
  onMount(store) {
    this.store = store;
    this.entities = store.systems.family.get(['collision', 'pos']).entities;
    store.actions.on(engineActions.UPDATE, () => {
      for (let i = 0; i < this.entities.length; ++i) {
        let entity = this.entities[i];
        for (let j = 0; j < i; ++j) {
          let target = this.entities[j];
          if (entity.geom.type === 'line' && target.geom.type === 'rect') {
            handleLineRect2(entity, target, store);
          }
          if (entity.geom.type === 'rect' && target.geom.type === 'line') {
            handleLineRect2(target, entity, store);
          }
        }
      }
    });
  }
}
