// uniform mat4 uTransform;
// uniform mat4 uModel;

uniform lowp vec3 uObjectColor;
uniform lowp vec3 uLightColor;
uniform lowp vec3 uLightPos;
uniform lowp vec3 uViewPos;

varying lowp vec3 vFragPos;
varying lowp vec3 vNormal;

void main(void) {
  lowp float ambientStrength = 0.1;
  lowp vec3 ambient = ambientStrength * uLightColor;

  lowp vec3 lightDir = normalize(uLightPos - vFragPos);

  lowp float lambertian = max(dot(vNormal, lightDir), 0.0);
  lowp float spec = 0.0;

  if (lambertian > 0.0) {
    lowp vec3 viewDir = normalize(uViewPos - vFragPos);

    lowp vec3 halfDir = normalize(lightDir + viewDir);
    lowp float specAngle = max(dot(halfDir, vNormal), 0.0);

    spec = pow(specAngle, 32.0);
  }

  lowp vec3 specular = spec * uLightColor;
  lowp vec3 diffuse = lambertian * uLightColor;

  lowp vec3 result = (ambient + diffuse + specular) * uObjectColor;
  gl_FragColor = vec4(result, 1.0);
}
