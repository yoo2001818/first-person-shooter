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
      PHONG_SHADER.useNormalMap = PHONG_SHADER.getUniform('uUseNormalMap');
      PHONG_SHADER.depthMapScale = PHONG_SHADER.getUniform('uDepthMapScale');
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
        shininess: PHONG_SHADER.getUniform('uMaterial.shininess'),
        diffuseMap: PHONG_SHADER.getUniform('uMaterial.diffuseMap'),
        specularMap: PHONG_SHADER.getUniform('uMaterial.specularMap'),
        normalMap: PHONG_SHADER.getUniform('uMaterial.normalMap'),
        depthMap: PHONG_SHADER.getUniform('uMaterial.depthMap')
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

    if (context.light.coneCutOff != null) {
      gl.uniform3fv(this.shader.light.coneDirection,
        context.light.coneDirection);
      gl.uniform2fv(this.shader.light.coneCutOff, context.light.coneCutOff);
    } else {
      gl.uniform2f(this.shader.light.coneCutOff, 0, 0);
    }
    // Use texture if available
    if (this.options.diffuseMap != null) {
      // Use texture #0
      gl.uniform1i(this.shader.material.diffuseMap, 0);
      this.options.diffuseMap.use(0);

      gl.uniform3f(this.shader.material.ambient, -1, -1, -1);
      gl.uniform3f(this.shader.material.diffuse, -1, -1, -1);
    } else {
      gl.uniform3fv(this.shader.material.ambient, this.options.ambient);
      gl.uniform3fv(this.shader.material.diffuse, this.options.diffuse);
    }
    if (this.options.specularMap != null) {
      // Use texture #1
      gl.uniform1i(this.shader.material.specularMap, 1);
      this.options.specularMap.use(1);

      gl.uniform3f(this.shader.material.specular, -1, -1, -1);
    } else {
      gl.uniform3fv(this.shader.material.specular, this.options.specular);
    }
    gl.uniform1f(this.shader.material.shininess, this.options.shininess);
    if (this.options.normalMap != null) {
      // Use texture #2
      gl.uniform1i(this.shader.material.normalMap, 2);
      this.options.normalMap.use(2);
      gl.uniform1i(this.shader.useNormalMap, 1);
    } else {
      gl.uniform1i(this.shader.useNormalMap, 0);
    }
    if (this.options.depthMap != null) {
      // Use texture #3
      gl.uniform1i(this.shader.material.depthMap, 3);
      this.options.depthMap.use(3);
      gl.uniform2fv(this.shader.depthMapScale, this.options.depthMapScale);
    } else {
      gl.uniform2f(this.shader.depthMapScale, 0, 0);
    }
  }
}
