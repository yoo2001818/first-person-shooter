import * as engineActions from '../action/engine';
import * as VelChanges from '../change/vel';
import { Vector } from 'kollision';

let vec1 = Vector.create(0, 0);

export default class CursorSystem {
  onMount(store) {
    this.store = store;
    this.pos = Vector.create(0, 0);
    this.entities = store.systems.family.get(['cursor', 'pos']).entities;
    store.actions.on(engineActions.UPDATE, () => {
      for (let i = 0; i < this.entities.length; ++i) {
        let entity = this.entities[i];
        Vector.subtract(this.pos, entity.pos.translate, vec1);
        Vector.multiply(vec1, 0.5, vec1);
        store.changes.push(VelChanges.set(entity, vec1));
      }
    });
    store.actions.on('cursor/move', action => {
      this.pos[0] = action.payload.x;
      this.pos[1] = action.payload.y;
    });
  }
}
