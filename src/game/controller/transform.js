import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as TransformChanges from '../change/transform';
import ignore from '../util/ignore';
import { vec3 as Vec3, quat as Quat } from 'gl-matrix';

const TransformController = {
  onMount(store) {
    store.changes.on(ECSChanges.SET, (event) => {
      const { entity, key, value } = event.data;
      if (key !== 'transform') return;
      // Check if required data is missing, and re-send it with default value
      // set.
      // Note that this doesn't check type and values.
      // TODO Maybe we should implement this in ECS side. Instead of using
      // if clause to filter out unnecessary events, we can just plug
      // component controllers to the ECSController if we implement that.
      if (value.position == null || value.rotation == null ||
        value.scale == null
      ) {
        let newValue = Object.assign({}, value);
        if (value.position == null) newValue.position = Vec3.create();
        if (value.rotation == null) newValue.rotation = Quat.create();
        if (value.scale == null) {
          newValue.scale = Vec3.create();
          Vec3.set(newValue.scale, 1, 1, 1);
        }
        store.changes.unshift(ECSChanges.set(entity, 'transform', newValue));
        return;
      }
      // Pass it to TransformChanges if it matches criteria.
      store.changes.unshift(ignore(TransformChanges.set(entity, value)));
    });
  },
  [TransformChanges.SET](event, store) {
    // Notify other controllers sub-changes.... TODO is it required?
    store.changes.unshift(
      ignore(TransformChanges.setPosition(entity, props.position)));
    store.changes.unshift(
      ignore(TransformChanges.setRotation(entity, props.rotation)));
    store.changes.unshift(
      ignore(TransformChanges.setScale(entity, props.scale)));
    if (event.ignore) return;
    const { entity, props } = event.data;
    entity.transform = props;
  },
  [TransformChanges.SET_POSITION](event) {
    if (event.ignore) return;
    const { entity, vec } = event.data;
    Vec3.copy(entity.transform.position, vec);
  },
  [TransformChanges.SET_ROTATION](event) {
    if (event.ignore) return;
    const { entity, quat } = event.data;
    Quat.copy(entity.transform.rotation, quat);
  },
  [TransformChanges.SET_SCALE](event) {
    if (event.ignore) return;
    const { entity, vec } = event.data;
    Vec3.copy(entity.transform.position, vec);
  },
  [TransformChanges.ADD_POSITION](event) {
    const { entity, vec } = event.data;
    Vec3.add(entity.transform.position, entity.transform.position, vec);
  },
  [TransformChanges.ADD_ROTATION](event) {
    const { entity, quat } = event.data;
    Quat.add(entity.transform.rotation, entity.transform.rotation, quat);
  }
};

export default TransformController;
