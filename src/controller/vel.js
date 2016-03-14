import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as VelChanges from '../change/vel';

const VelController = {
  onMount: store => {
    store.changes.on(ECSChanges.SET, event => {
      const { entity, key, value: {x, y} } = event.data;
      if (key === 'vel') {
        store.changes.unshift(VelChanges.set(entity, x, y, 0, false));
      }
    });
  },
  [VelChanges.SET]: (event, store) => {
    const { entity, x, y, write } = event.data;
    if (write) {
      store.changes.unshift(ECSChanges.set(entity, 'vel', {
        x, y
      }));
    }
  },
  [VelChanges.ADD]: (event, store) => {
    const { entity, x, y } = event.data;
    store.changes.unshift(VelChanges.set(entity,
      entity.pos.x + x, entity.pos.y + y
    ));
  }
};

export default VelController;
