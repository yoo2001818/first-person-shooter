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
      PHONG_SHADER.viewPos = PHONG_SHADER.getUniform('uViewPos');
      PHONG_SHADER.light = {
        position: PHONG_SHADER.getUniform('uLight.position'),
        ambient: PHONG_SHADER.getUniform('uLight.ambient'),
        diffuse: PHONG_SHADER.getUniform('uLight.diffuse'),
        specular: PHONG_SHADER.getUniform('uLight.specular'),
        attenuation: PHONG_SHADER.getUniform('uLight.attenuation'),
        coneDirection: PHONG_SHADER.getUniform('uLight.coneDirection'),
        coneCutOff: PHONG_SHADER.getUniform('uLight.coneCutOff')
      };
      PHONG_SHADER.material = {
        ambient: PHONG_SHADER.getUniform('uMaterial.ambient'),
        diffuse: PHONG_SHADER.getUniform('uMaterial.diffuse'),
        specular: PHONG_SHADER.getUniform('uMaterial.specular'),
        shininess: PHONG_SHADER.getUniform('uMaterial.shininess')
      };
    }
    super(context, PHONG_SHADER);
    this.options = options;
  }
  use(geometry, context) {
    super.use(geometry, context);
    const gl = this.gl;
    gl.uniform3fv(this.shader.viewPos, context.viewPos);

    gl.uniform4fv(this.shader.light.position, context.light.position);

    gl.uniform3fv(this.shader.light.ambient, context.light.ambient);
    gl.uniform3fv(this.shader.light.diffuse, context.light.diffuse);
    gl.uniform3fv(this.shader.light.specular, context.light.specular);

    gl.uniform1f(this.shader.light.attenuation, context.light.attenuation);

    if (context.light.coneCutOff) {
      gl.uniform3fv(this.shader.light.coneDirection,
        context.light.coneDirection);
      gl.uniform2fv(this.shader.light.coneCutOff, context.light.coneCutOff);
    } else {
      gl.uniform2f(this.shader.light.coneCutOff, 0, 0);
    }
    gl.uniform3fv(this.shader.material.ambient, this.options.ambient);
    gl.uniform3fv(this.shader.material.diffuse, this.options.diffuse);
    gl.uniform3fv(this.shader.material.specular, this.options.specular);
    gl.uniform1f(this.shader.material.shininess, this.options.shininess);
  }
}
