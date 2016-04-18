import StoreFactory from 'ecsalator';
import ECSState from 'ecsalator/lib/ecs/state';
import ECSController from 'ecsalator/lib/ecs/controller';
import FamilySystem from 'ecsalator/lib/ecs/familySystem';

// import logger from '../middleware/logger';

import TransformController from '../controller/transform';
import VelocityController from '../controller/velocity';
import EditorController from '../controller/editor';

import DebugSystem from '../system/debug';
// import VelSystem from '../system/vel';
// import CollisionSystem from '../system/collision';
// import CursorSystem from '../system/cursor';
import MatrixSystem from '../system/matrix';
import EditorSystem from '../system/editor';

// Configure game store object
export default function createStore() {
  let factory = new StoreFactory();
  // Add controller
  factory.addController('ecs', ECSController);
  factory.addController('transform', TransformController);
  factory.addController('velocity', VelocityController);
  factory.addController('editor', EditorController);
  // Add system
  factory.addSystem('family', FamilySystem);
  factory.addSystem('debug', DebugSystem);
  // factory.addSystem('vel', VelSystem);
  // factory.addSystem('collision', CollisionSystem);
  // factory.addSystem('cursor', CursorSystem);
  factory.addSystem('matrix', MatrixSystem);
  factory.addSystem('editor', EditorSystem);
  // Add middleware
  // factory.addMiddleware(logger);
  // Set state
  factory.setState(new ECSState([
    'transform', 'mesh', 'light', 'camera', 'velocity',
    'collision', 'hierarchy', 'name'
  ]));
  // Finally set up the state and return object
  return factory.create();
}
