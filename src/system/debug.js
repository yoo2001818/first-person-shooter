import * as engineActions from '../action/engine';
import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import * as GeometryType from '../util/geometryType';
import { Vector } from 'kollision';

// A system doing various testing chores.
export default class DebugSystem {
  onMount(store) {
    this.store = store;
    store.actions.on(engineActions.INIT, () => {
      store.changes.push(ECSChanges.entityCreate(undefined, {
        pos: {
          translate: Vector.create(100, 50),
          scale: Vector.create(50, 50),
          type: GeometryType.RECT
        },
        vel: Vector.create(1, 0),
        collision: {

        },
        render: {
          color: '#000'
        },
        cursor: {}
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        pos: {
          translate: Vector.create(-100, 10),
          scale: Vector.create(100, 0),
          type: GeometryType.LINE
        },
        collision: {

        },
        render: {
          color: '#00f'
        }
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        pos: {
          translate: Vector.create(200, 10),
          scale: Vector.create(200, 100),
          type: GeometryType.LINE
        },
        collision: {

        },
        render: {
          color: '#00f'
        }
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        pos: {
          translate: Vector.create(100, -290),
          scale: Vector.create(-100, 200),
          type: GeometryType.LINE
        },
        collision: {

        },
        render: {
          color: '#00f'
        }
      }));
    });
  }
}
