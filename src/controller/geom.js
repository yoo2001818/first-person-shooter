import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as GeomChanges from '../change/geom';

const GeometryController = {
  onMount: store => {
    store.changes.on(ECSChanges.SET, event => {
      const { entity, key, value } = event.data;
      if (key === 'geom') {
        store.changes.push(GeomChanges.set(entity, value, false));
      }
    });
  },
  [GeomChanges.SET]: (event, store) => {
    const { entity, data, write } = event.data;
    if (write) {
      store.changes.push(ECSChanges.set(entity, 'geom', data));
    }
  }
};

export default GeometryController;
