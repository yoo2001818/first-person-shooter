import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as PosChanges from '../change/pos';

const PosController = {
  onMount: store => {
    store.changes.on(ECSChanges.SET, event => {
      const { entity, key, value: {x, y} } = event.data;
      if (key === 'pos') {
        store.changes.unshift(PosChanges.set(entity, x, y, 0, false));
      }
    });
  },
  [PosChanges.SET]: (event, store) => {
    const { entity, x, y, write } = event.data;
    if (write) {
      store.changes.unshift(ECSChanges.set(entity, 'pos', {
        x, y
      }));
    }
  },
  [PosChanges.ADD]: (event, store) => {
    const { entity, x, y } = event.data;
    store.changes.unshift(PosChanges.set(entity,
      entity.pos.x + x, entity.pos.y + y
    ));
  }
};

export default PosController;
