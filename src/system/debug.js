import * as engineActions from '../action/engine';
import * as ECSChanges from 'ecsalator/lib/ecs/changes';

// A system doing various testing chores.
export default class DebugSystem {
  onMount(store) {
    this.store = store;
    store.actions.on(engineActions.INIT, () => {
      store.changes.push(ECSChanges.entityCreate(undefined, {
        pos: {
          x: 100, y: 50
        },
        vel: {
          x: 0, y: 1
        },
        collision: {

        },
        geom: {
          type: 'rect', width: 100, height: 100
        },
        render: {
          color: '#000'
        }
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        pos: {
          x: 100, y: 200
        },
        collision: {

        },
        geom: {
          type: 'line', width: 300, height: 100
        },
        render: {
          color: '#f00'
        }
      }));
    });
  }
}
