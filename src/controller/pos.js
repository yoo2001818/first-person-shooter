import registerComponent from '../util/registerComponent';

import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as PosChanges from '../change/pos';

const PosController = {
  onMount: store => {
    store.changes.on(ECSChanges.SET, event => {
      const { entity, key, value: {x, y} } = event;
      if (key === 'pos') {
        store.changes.push(PosChanges.set(entity, x, y, 0, false));
      }
    });
  },
  [PosChanges.SET]: (event, store) => {
    const { entity, x, y, write } = event;
    if (write) {
      store.changes.push(ECSChanges.set(entity, 'pos', {
        x, y
      }));
    }
  },
  [PosChanges.ADD]: (event, store) => {
    const { entity, x, y } = event;
    store.changes.push(PosChanges.set(entity,
      entity.pos.x + x, entity.pos.y + y
    ));
  }
};

registerComponent('pos');

export default PosController;
