import Material from './material';
import Shader from './shader';

const SKYBOX_SHADER = new WeakMap();

export default class SkyboxMaterial extends Material {
  constructor(context, texture) {
    if (!SKYBOX_SHADER.has(context)) {
      let shader = new Shader(context);
      shader.loadVertexShader(require('../shader/skybox.vert'));
      shader.loadFragmentShader(require('../shader/skybox.frag'));
      shader.link();
      shader.skybox = shader.getUniform('uSkybox');
      SKYBOX_SHADER.set(context, shader);
    }
    super(context, SKYBOX_SHADER.get(context));
    this.texture = texture;
  }
  use(geometry, context) {
    super.use(geometry, context);
    const gl = this.gl;
    gl.uniform1i(this.shader.skybox, 0);
    this.texture.use(0);
  }
}
