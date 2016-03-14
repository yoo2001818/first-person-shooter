import StoreFactory from 'ecsalator';
import ECSState from 'ecsalator/lib/ecs/state';
import ECSController from 'ecsalator/lib/ecs/controller';
import FamilySystem from 'ecsalator/lib/ecs/familySystem';

import { components } from '../util/registerComponent';

// import logger from '../middleware/logger';

import GeometryController from '../controller/geom';
import PosController from '../controller/pos';
import VelController from '../controller/vel';

import DebugSystem from '../system/debug';
import VelSystem from '../system/vel';

// Configure game store object
export default function createStore() {
  let factory = new StoreFactory();
  // Add controller
  factory.addController('ecs', ECSController);
  factory.addController('pos', PosController);
  factory.addController('geom', GeometryController);
  factory.addController('vel', VelController);
  // Add system
  factory.addSystem('family', FamilySystem);
  factory.addSystem('debug', DebugSystem);
  factory.addSystem('vel', VelSystem);
  // Add middleware
  // factory.addMiddleware(logger);
  // Set state
  factory.setState(new ECSState(components));
  // Finally set up the state and return object
  return factory.create();
}
