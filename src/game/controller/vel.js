import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as VelChanges from '../change/vel';
import { Vector } from 'kollision';

const VelController = {
  [VelChanges.SET]: (event, store) => {
    const { entity, vec } = event.data;
    Vector.copy(vec, entity.vel);
    store.changes.unshift(ECSChanges.set(entity, 'vel', vec));
  },
  [VelChanges.ADD]: (event) => {
    const { entity, vec } = event.data;
    Vector.add(entity.vel, vec, entity.vel);
  }
};

export default VelController;
