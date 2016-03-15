import * as engineActions from '../action/engine';
import * as PosChanges from '../change/pos';
// import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as Collision from '../geom/collision';

function handleLineRect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let points = Collision.lineRect(x1, y1, x2, y2, x3, y3, x4, y4);
  if (!points) return null;
  // 2 intersections test
  for (let i = 0; i < 4; ++i) {
    let p1 = points[i];
    let p2 = points[(i + 1) % 4];
    if (p1 && p2) {
      let x = i % 2 ? p2.x - p1.x : p1.x - p2.x;
      let y = i % 2 ? p1.y - p2.y : p2.y - p1.y;
      let xBig = Math.abs(x) > Math.abs(y);
      return {
        x: xBig ? 0 : x,
        y: xBig ? y : 0
      };
    }
  }
  // 3 intersections test... Currently not done
  if (points[0] && points[2]) {
    let p1 = points[0];
    let p2 = points[2];
    let pMid = (p1.x + p2.x) / 2;
    let xMid = (x3 + x4) / 2;
    let x;
    if (xMid < pMid) {
      x = Math.max(p1.x, p2.x) - Math.max(x3, x4);
    } else {
      x = Math.min(p1.x, p2.x) - Math.min(x3, x4);
    }
    return {
      x, y: 0
    };
  }
  if (points[1] && points[3]) {
    let p1 = points[1];
    let p2 = points[3];
    let pMid = (p1.y + p2.y) / 2;
    let yMid = (y3 + y4) / 2;
    let y;
    if (yMid < pMid) {
      y = Math.max(p1.y, p2.y) - Math.max(y3, y4);
    } else {
      y = Math.min(p1.y, p2.y) - Math.min(y3, y4);
    }
    return {
      x: 0, y
    };
  }
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
