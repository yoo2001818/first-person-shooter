import * as engineActions from '../action/engine';
import * as PosChanges from '../change/pos';

// A system moving entities every tick.
export default class VelocitySystem {
  onMount(store) {
    this.store = store;
    this.entities = store.systems.family.get(['vel', 'pos']).entities;
    store.actions.on(engineActions.UPDATE, () => {
      for (let i = 0; i < this.entities.length; ++i) {
        let entity = this.entities[i];
        store.changes.push(PosChanges.translate(entity, entity.vel));
      }
    });
  }
}
