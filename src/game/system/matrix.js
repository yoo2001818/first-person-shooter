import * as TransformChanges from '../change/transform';
import { mat4 as Mat4 } from 'gl-matrix';

export default class MatrixSystem {
  onMount(store) {
    this.store = store;
    this.matrices = [];
    // TODO We definitely need some kind of changes dependancy manager,
    // allowing 'bubbling' events.
    // Without that, source code looks like this, which is horrible.
    store.changes.on(TransformChanges.SET, (event) => {
      const { entity } = event.data;
      this.updateMatrix(entity);
    });
    store.changes.on(TransformChanges.SET_POSITION, (event) => {
      if (event.ignore) return;
      const { entity } = event.data;
      this.updateMatrix(entity);
    });
    store.changes.on(TransformChanges.SET_ROTATION, (event) => {
      if (event.ignore) return;
      const { entity } = event.data;
      this.updateMatrix(entity);
    });
    store.changes.on(TransformChanges.SET_SCALE, (event) => {
      if (event.ignore) return;
      const { entity } = event.data;
      this.updateMatrix(entity);
    });
    store.changes.on(TransformChanges.ADD_POSITION, (event) => {
      if (event.ignore) return;
      const { entity } = event.data;
      this.updateMatrix(entity);
    });
    store.changes.on(TransformChanges.ADD_ROTATION, (event) => {
      if (event.ignore) return;
      const { entity } = event.data;
      this.updateMatrix(entity);
    });
    // TODO entity remove
  }
  updateMatrix(entity) {
    let matrix = this.matrices[entity.id];
    if (matrix == null) {
      matrix = this.matrices[entity.id] = Mat4.create();
    }
    Mat4.fromRotationTranslation(matrix,
      entity.transform.rotation, entity.transform.position);
    Mat4.scale(matrix, matrix, entity.transform.scale);
  }
  get(entityId) {
    return this.matrices[entityId];
  }
}
