import Material from './material';
import Shader from './shader';

let PHONG_SHADER;

export default class PhongMaterial extends Material {
  constructor(context, options) {
    if (PHONG_SHADER == null) {
      PHONG_SHADER = new Shader(context);
      PHONG_SHADER.loadVertexShader(require('../shader/phong.vert'));
      PHONG_SHADER.loadFragmentShader(require('../shader/phong.frag'));
      PHONG_SHADER.link();
    }
    super(context, PHONG_SHADER);
    this.options = options;
  }
  use(geometry, context) {
    super.use(geometry, context);
    const gl = this.gl;
    gl.uniform3fv(this.shader.getUniform('uViewPos'),
      context.viewPos);
    gl.uniform3fv(this.shader.getUniform('uLightPos'),
      context.lightPos);
    gl.uniform3fv(this.shader.getUniform('uLightColor'),
      context.lightColor);
    gl.uniform3fv(this.shader.getUniform('uObjectColor'),
      this.options.objectColor);
  }
}
