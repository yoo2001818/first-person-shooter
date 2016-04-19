import TransformPanel from './transform';
import VelocityPanel from './velocity';
import MeshPanel from './mesh';
import LightPanel from './light';
import CameraPanel from './camera';

export default {
  id: null,
  name: null,
  transform: TransformPanel,
  velocity: VelocityPanel,
  mesh: MeshPanel,
  light: LightPanel,
  camera: CameraPanel
};
