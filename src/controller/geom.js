import registerComponent from '../util/registerComponent';

import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as PosChanges from '../change/pos';

const GeometryController = {
  onMount: store => {
    store.changes.on(ECSChanges.SET, event => {
      const { entity, key, value } = event;
      if (key === 'geom') {
        store.changes.push(PosChanges.set(entity, value, false));
      }
    });
  },
  SET: (event, store) => {
    const { entity, data, write } = event;
    if (write) {
      store.changes.push(ECSChanges.set(entity, 'geom', data));
    }
  }
};

registerComponent('geom');

export default GeometryController;
