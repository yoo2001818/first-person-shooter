import Material from './material';
import Shader from './shader';

let SKYBOX_SHADER;

export default class SkyboxMaterial extends Material {
  constructor(context, texture) {
    if (SKYBOX_SHADER == null) {
      SKYBOX_SHADER = new Shader(context);
      SKYBOX_SHADER.loadVertexShader(require('../shader/skybox.vert'));
      SKYBOX_SHADER.loadFragmentShader(require('../shader/skybox.frag'));
      SKYBOX_SHADER.link();
      SKYBOX_SHADER.skybox = SKYBOX_SHADER.getUniform('uSkybox');
    }
    super(context, SKYBOX_SHADER);
    this.texture = texture;
  }
  use(geometry, context) {
    super.use(geometry, context);
    const gl = this.gl;
    gl.uniform1i(this.shader.skybox, 0);
    this.texture.use(0);
  }
}
