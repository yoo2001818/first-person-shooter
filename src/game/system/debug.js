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
        name: 'Character',
        pos: {
          translate: Vector.create(100, 50),
          scale: Vector.create(50, 50),
          type: GeometryType.RECT
        },
        vel: Vector.create(1, 0),
        collision: {

        },
        render: {
          color: '#000000'
        },
        cursor: {}
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        name: 'Line 1',
        pos: {
          translate: Vector.create(-100, 100),
          scale: Vector.create(100, 0),
          type: GeometryType.LINE
        },
        collision: {

        },
        render: {
          color: '#0000ff'
        }
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        name: 'Line 2',
        pos: {
          translate: Vector.create(-200, -100),
          scale: Vector.create(0, 100),
          type: GeometryType.LINE
        },
        collision: {

        },
        render: {
          color: '#0000ff'
        }
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        name: 'Line 3',
        pos: {
          translate: Vector.create(200, 10),
          scale: Vector.create(200, 100),
          type: GeometryType.LINE
        },
        collision: {

        },
        render: {
          color: '#0000ff'
        }
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        name: 'Line 4',
        pos: {
          translate: Vector.create(100, -290),
          scale: Vector.create(-100, 200),
          type: GeometryType.LINE
        },
        collision: {

        },
        render: {
          color: '#0000ff'
        }
      }));
    });
  }
}
