// uniform mat4 uTransform;
// uniform mat4 uModel;

struct Material {
  lowp vec3 ambient;
  lowp vec3 diffuse;
  lowp vec3 specular;
  lowp float shininess;
};

struct Light {
  lowp vec4 position;

  lowp vec3 ambient;
  lowp vec3 diffuse;
  lowp vec3 specular;

  lowp vec3 intensity;
};

uniform Material uMaterial;
uniform Light uLight;
uniform lowp vec3 uViewPos;

varying lowp vec3 vFragPos;
varying lowp vec3 vNormal;

void main(void) {
  lowp vec3 lightDir =
    uLight.position.xyz - vFragPos * uLight.position.w;
  lowp float distance = length(lightDir);
  lightDir = lightDir / distance;

  // x: constant, y: linear, z: quadratic
  lowp float attenuation = 1.0 / (uLight.intensity.x +
    uLight.intensity.y * distance +
    uLight.intensity.z * (distance * distance));


  lowp float lambertian = max(dot(vNormal, lightDir), 0.0);
  lowp float spec = 0.0;
  if (lambertian > 0.0) {
    lowp vec3 viewDir = normalize(uViewPos - vFragPos);

    lowp vec3 halfDir = normalize(lightDir + viewDir);
    lowp float specAngle = max(dot(halfDir, vNormal), 0.0);

    spec = pow(specAngle, uMaterial.shininess);
  }

  lowp vec3 ambient = uMaterial.ambient * uLight.ambient;
  lowp vec3 diffuse = lambertian * uMaterial.diffuse * uLight.diffuse;
  lowp vec3 specular = spec * uMaterial.specular * uLight.specular;

  lowp vec3 result = (ambient + diffuse + specular) * attenuation;
  gl_FragColor = vec4(result, 1.0);
}
