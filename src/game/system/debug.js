import * as engineActions from '../action/engine';
import * as ECSChanges from 'ecsalator/lib/ecs/changes';
import { vec3 as Vec3, quat as Quat } from 'gl-matrix';

// A system doing various testing chores.
export default class DebugSystem {
  onMount(store) {
    this.store = store;
    store.actions.on(engineActions.INIT, () => {
      store.changes.push(ECSChanges.entityCreate(undefined, {
        name: 'Character',
        transform: {
          position: Vec3.create(),
          rotation: Quat.create(),
          scale: Vec3.set(Vec3.create(), 1, 1, 1)
        },
        velocity: Vec3.create(),
        mesh: {
          geometry: 'Box',
          material: 'Test'
        }
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        name: 'Light',
        transform: {
          position: Vec3.set(Vec3.create(), 0, 10, 0),
          rotation: Quat.rotateY(Quat.create(), Quat.create(), Math.PI / 2)
        },
        light: {
          type: 'spot',
          position: Vec3.create(),
          direction: Vec3.set(Vec3.create(), 1, 0, 0),
          angle: new Float32Array([27.5, 45]),
          attenuation: 0.045,
          ambient: new Float32Array([0.2, 0.2, 0.2]),
          diffuse: new Float32Array([1, 1, 1]),
          specular: new Float32Array([1, 1, 1])
        }
      }));
      store.changes.push(ECSChanges.entityCreate(undefined, {
        name: 'Camera',
        transform: {
          position: Vec3.set(Vec3.create(), 0, 0, 10),
          rotation: Quat.rotateZ(Quat.create(), Quat.create(), -Math.PI / 2)
        },
        camera: {
          type: 'perspective',
          near: 0.03,
          far: 1000,
          fov: 60 / 180 * Math.PI
        }
      }));
    });
  }
}
