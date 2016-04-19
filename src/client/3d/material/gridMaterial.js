import Material from '../material';
import Shader from '../shader';

const GRID_SHADER = new WeakMap();

export default class GridMaterial extends Material {
  constructor(context, color, hColor, vColor) {
    if (!GRID_SHADER.has(context)) {
      let shader = new Shader(context);
      shader.loadVertexShader(require('../../shader/grid.vert'));
      shader.loadFragmentShader(require('../../shader/grid.frag'));
      shader.link();
      shader.color = shader.getUniform('uColor');
      shader.hColor = shader.getUniform('uHoriColor');
      shader.vColor = shader.getUniform('uVertColor');
      GRID_SHADER.set(context, shader);
    }
    super(context, GRID_SHADER.get(context));
    this.color = color;
    this.hColor = hColor;
    this.vColor = vColor;
  }
  use(geometry, context) {
    super.use(geometry, context);
    const gl = this.gl;
    gl.uniform3fv(this.shader.color, this.color);
    gl.uniform3fv(this.shader.hColor, this.hColor);
    gl.uniform3fv(this.shader.vColor, this.vColor);
  }
}
