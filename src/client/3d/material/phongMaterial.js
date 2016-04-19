import Material from '../material';
import Shader from '../shader';

const PHONG_SHADER = new WeakMap();

export default class PhongMaterial extends Material {
  constructor(context, options) {
    if (!PHONG_SHADER.has(context)) {
      let shader = new Shader(context);
      shader.loadVertexShader(require('../../shader/phong.vert'));
      shader.loadFragmentShader(require('../../shader/phong.frag'));
      shader.link();
      shader.viewPos = shader.getUniform('uViewPos');
      shader.useNormalMap = shader.getUniform('uUseNormalMap');
      shader.depthMapScale = shader.getUniform('uDepthMapScale');
      shader.lightSize = shader.getUniform('uLightSize');
      shader.lights = [];
      for (let i = 0; i < 8; ++i) {
        let lightName = 'uLight[' + i + '].';
        shader.lights.push({
          position: shader.getUniform(lightName + 'position'),
          ambient: shader.getUniform(lightName + 'ambient'),
          diffuse: shader.getUniform(lightName + 'diffuse'),
          specular: shader.getUniform(lightName + 'specular'),
          attenuation: shader.getUniform(lightName + 'attenuation'),
          coneDirection: shader.getUniform(lightName + 'coneDirection'),
          coneCutOff: shader.getUniform(lightName + 'coneCutOff')
        });
      }
      shader.material = {
        ambient: shader.getUniform('uMaterial.ambient'),
        diffuse: shader.getUniform('uMaterial.diffuse'),
        specular: shader.getUniform('uMaterial.specular'),
        shininess: shader.getUniform('uMaterial.shininess')
      };
      shader.diffuseMap = shader.getUniform('uDiffuseMap');
      shader.specularMap = shader.getUniform('uSpecularMap');
      shader.normalMap = shader.getUniform('uNormalMap');
      shader.depthMap = shader.getUniform('uDepthMap');
      PHONG_SHADER.set(context, shader);
    }
    super(context, PHONG_SHADER.get(context));
    this.options = options;
  }
  use(geometry, context) {
    super.use(geometry, context);
    const gl = this.gl;
    gl.uniform3fv(this.shader.viewPos, context.viewPos);

    gl.uniform1i(this.shader.lightSize, context.lights.length);
    context.lights.forEach((light, id) => {
      if (id >= 8) {
        throw new Error('Maximum lights limit is 8');
      }
      gl.uniform4fv(this.shader.lights[id].position, light.position);
      gl.uniform3fv(this.shader.lights[id].ambient, light.ambient);
      gl.uniform3fv(this.shader.lights[id].diffuse, light.diffuse);
      gl.uniform3fv(this.shader.lights[id].specular, light.specular);

      gl.uniform1f(this.shader.lights[id].attenuation, light.attenuation);

      if (light.coneCutOff != null) {
        gl.uniform3fv(this.shader.lights[id].coneDirection,
          light.coneDirection);
        gl.uniform2fv(this.shader.lights[id].coneCutOff, light.coneCutOff);
      } else {
        gl.uniform2f(this.shader.lights[id].coneCutOff, 0, 0);
      }
    });
    // Use texture if available
    if (this.options.diffuseMap != null) {
      // Use texture #0
      gl.uniform1i(this.shader.diffuseMap, 0);
      this.options.diffuseMap.use(0);

      gl.uniform3f(this.shader.material.ambient, -1, -1, -1);
      gl.uniform3f(this.shader.material.diffuse, -1, -1, -1);
    } else {
      gl.uniform3fv(this.shader.material.ambient, this.options.ambient);
      gl.uniform3fv(this.shader.material.diffuse, this.options.diffuse);
    }
    if (this.options.specularMap != null) {
      // Use texture #1
      gl.uniform1i(this.shader.specularMap, 1);
      this.options.specularMap.use(1);

      gl.uniform3f(this.shader.material.specular, -1, -1, -1);
    } else {
      gl.uniform3fv(this.shader.material.specular, this.options.specular);
    }
    gl.uniform1f(this.shader.material.shininess, this.options.shininess);
    if (this.options.normalMap != null) {
      // Use texture #2
      gl.uniform1i(this.shader.normalMap, 2);
      this.options.normalMap.use(2);
      gl.uniform1i(this.shader.useNormalMap, 1);
    } else {
      gl.uniform1i(this.shader.useNormalMap, 0);
    }
    if (this.options.depthMap != null) {
      // Use texture #3
      gl.uniform1i(this.shader.depthMap, 3);
      this.options.depthMap.use(3);
      gl.uniform2fv(this.shader.depthMapScale, this.options.depthMapScale);
    } else {
      gl.uniform2f(this.shader.depthMapScale, 0, 0);
    }
  }
}
