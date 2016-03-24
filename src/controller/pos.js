import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as PosChanges from '../change/pos';
import { Vector } from 'kollision';

const PosController = {
  [PosChanges.SET]: (event, store) => {
    const { entity, translate, scale, type } = event.data;
    store.changes.unshift(ECSChanges.set(entity, 'pos', {
      translate, scale, type
    }));
  },
  [PosChanges.SET_POS]: (event) => {
    const { entity, vec } = event.data;
    Vector.copy(vec, entity.pos.translate);
  },
  [PosChanges.TRANSLATE]: (event, store) => {
    const { entity, vec } = event.data;
    /*
    store.changes.unshift(PosChanges.set(entity,
      entity.pos.x + x, entity.pos.y + y
    ));
    */
    if (store.state.globals.debug == null) store.state.globals.debug = [];
    store.state.globals.debug.push({
      vector: true,
      x: entity.pos.translate[0], y: entity.pos.translate[1],
      vx: vec[0], vy: vec[1]
    });
    Vector.add(entity.pos.translate, vec, entity.pos.translate);
  }
};

export default PosController;
