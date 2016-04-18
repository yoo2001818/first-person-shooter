import * as TransformChanges from '../change/transform';
import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import { vec3 as Vec3, mat4 as Mat4, quat as Quat } from 'gl-matrix';

const QUAT_BUFFER = Quat.create();
const VEC3_BUFFER = Vec3.create();

export default class MatrixSystem {
  onMount(store) {
    this.store = store;
    this.matrices = [];
    this.inverseMatrices = [];
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
    store.changes.on(ECSChanges.REMOVE, (event) => {
      const { entity, key } = event.data;
      if (key !== 'transform') return;
      this.removeMatrix(entity);
    });
    store.changes.on(ECSChanges.ENTITY_REMOVE, (event) => {
      const { entity } = event.data;
      if (entity.transform == null) return;
      this.removeMatrix(entity);
    });
  }
  updateMatrix(entity) {
    // Calculate matrix
    let matrix = this.matrices[entity.id];
    if (matrix == null) {
      matrix = this.matrices[entity.id] = Mat4.create();
    }
    Mat4.fromRotationTranslation(matrix,
      entity.transform.rotation, entity.transform.position);
    Mat4.scale(matrix, matrix, entity.transform.scale);
    // Calculate inverse matrix. This should be much cheaper than matrix
    // inverse, which is expensive.
    let inverseMatrix = this.inverseMatrices[entity.id];
    if (inverseMatrix == null) {
      inverseMatrix = this.inverseMatrices[entity.id] = Mat4.create();
    }
    // TODO maybe we can use conjugate function
    let quat = Quat.invert(QUAT_BUFFER, entity.transform.rotation);
    let vec = Vec3.negate(VEC3_BUFFER, entity.transform.position);
    Mat4.fromRotationTranslation(inverseMatrix, quat, vec);
    vec = Vec3.negate(VEC3_BUFFER, entity.transform.scale);
    Mat4.scale(inverseMatrix, inverseMatrix, vec);
  }
  removeMatrix(entity) {
    delete this.matrices[entity.id];
    delete this.inverseMatrices[entity.id];
  }
  get(entityId) {
    return this.matrices[entityId];
  }
  getInverse(entityId) {
    return this.inverseMatrices[entityId];
  }
}
