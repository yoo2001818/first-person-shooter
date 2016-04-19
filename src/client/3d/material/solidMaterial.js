import Material from '../material';
import Shader from '../shader';

const SOLID_SHADER = new WeakMap();

export default class SolidMaterial extends Material {
  constructor(context, options) {
    if (!SOLID_SHADER.has(context)) {
      let shader = new Shader(context);
      shader.loadVertexShader(require('../../shader/solid.vert'));
      shader.loadFragmentShader(require('../../shader/solid.frag'));
      shader.link();
      shader.viewPos = shader.getUniform('uViewPos');
      shader.material = {
        specular: shader.getUniform('uMaterial.specular'),
        diffuse: shader.getUniform('uMaterial.diffuse'),
        ambient: shader.getUniform('uMaterial.ambient'),
        reflection: shader.getUniform('uMaterial.reflection'),
        shininess: shader.getUniform('uMaterial.shininess')
      };
      SOLID_SHADER.set(context, shader);
    }
    super(context, SOLID_SHADER.get(context));
    this.options = options;
  }
  use(geometry, context) {
    super.use(geometry, context);
    const gl = this.gl;
    gl.uniform3fv(this.shader.viewPos, context.viewPos);
    gl.uniform3fv(this.shader.material.specular, this.options.specular);
    gl.uniform3fv(this.shader.material.diffuse, this.options.diffuse);
    gl.uniform3fv(this.shader.material.ambient, this.options.ambient);
    gl.uniform3fv(this.shader.material.reflection, this.options.reflection);
    gl.uniform1f(this.shader.material.shininess, this.options.shininess);
  }
}
