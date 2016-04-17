import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as VelocityChanges from '../change/velocity';
import ignore from '../util/ignore';
import { vec3 as Vec3 } from 'gl-matrix';

const VelocityController = {
  onMount: (store) => {
    store.changes.on(ECSChanges.SET, (event) => {
      const { entity, key, value } = event.data;
      if (key !== 'velocity') return;
      if (value == null) {
        let newValue = Vec3.create();
        store.changes.unshift(ECSChanges.set(entity, 'velocity', newValue));
        return;
      }
      // Pass it to VelocityChanges if it matches criteria.
      store.changes.unshift(ignore(VelocityChanges.set(entity, value)));
    });
  },
  [VelocityChanges.SET]: (event) => {
    if (event.ignore) return;
    const { entity, vec } = event.data;
    Vec3.copy(entity.velocity, vec);
  },
  [VelocityChanges.ADD]: (event) => {
    if (event.ignore) return;
    const { entity, vec } = event.data;
    Vec3.add(entity.velocity, entity.velocity, vec);
  }
};

export default VelocityController;
