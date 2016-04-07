// uniform mat4 uTransform;
// uniform mat4 uModel;

struct Material {
  lowp vec3 ambient;
  lowp vec3 diffuse;
  lowp vec3 specular;

  lowp float shininess;

  sampler2D diffuseMap;
  sampler2D specularMap;
  sampler2D normalMap;
};

struct Light {
  lowp vec4 position;

  lowp vec3 ambient;
  lowp vec3 diffuse;
  lowp vec3 specular;

  lowp float attenuation;

  lowp vec2 coneCutOff;
  lowp vec3 coneDirection;
};

uniform Material uMaterial;
uniform Light uLight;
uniform lowp vec3 uViewPos;
uniform bool uUseNormalMap;

varying lowp vec3 vFragPos;
varying lowp vec3 vNormal;
varying lowp vec2 vTexCoord;
varying lowp mat3 vTangent;

void main(void) {
  lowp vec3 normal = vNormal;
  if (uUseNormalMap) {
    normal = texture2D(uMaterial.normalMap, vTexCoord).xyz;
    // Again, OpenGL uses inverted Y axis, so we need to invert this as well.
    normal.y = 1.0 - normal.y;
    normal = normalize(normal * 2.0 - 1.0);
    normal = normalize(vTangent * normal);
  }
  lowp vec3 lightDir =
    uLight.position.xyz - vFragPos * uLight.position.w;
  lowp float distance = length(lightDir);
  lightDir = lightDir / distance;

  lowp float attenuation = 1.0 / ( 1.0 +
    uLight.attenuation * (distance * distance) * uLight.position.w);

  lowp float lambertian = max(dot(normal, lightDir), 0.0);
  lowp float spec = 0.0;
  if (lambertian > 0.0) {
    lowp vec3 viewDir = normalize(uViewPos - vFragPos);

    lowp vec3 halfDir = normalize(lightDir + viewDir);
    lowp float specAngle = max(dot(halfDir, normal), 0.0);

    spec = pow(specAngle, uMaterial.shininess);
  }

  lowp vec3 ambient;
  if (uMaterial.ambient.x == -1.0) {
    ambient = texture2D(uMaterial.diffuseMap, vTexCoord).xyz;
  } else {
    ambient = uMaterial.ambient;
  }
  ambient *= uLight.ambient;

  lowp vec3 diffuse;
  if (uMaterial.diffuse.x == -1.0) {
    diffuse = texture2D(uMaterial.diffuseMap, vTexCoord).xyz;
  } else {
    diffuse = uMaterial.diffuse;
  }
  diffuse *= lambertian * uLight.diffuse;

  lowp vec3 specular;
  if (uMaterial.specular.x == -1.0) {
    specular = texture2D(uMaterial.specularMap, vTexCoord).xyz;
  } else {
    specular = uMaterial.specular;
  }
  specular *= spec * uLight.specular;

  if (uLight.coneCutOff.y > 0.0) {
    lowp float theta = dot(lightDir, normalize(-uLight.coneDirection));
    lowp float epsilon = uLight.coneCutOff.x - uLight.coneCutOff.y;
    lowp float intensity = clamp((theta - uLight.coneCutOff.y) / epsilon,
      0.0, 1.0);
    diffuse *= intensity;
    specular *= intensity;
  }

  lowp vec3 result = (ambient + diffuse + specular) * attenuation;
  gl_FragColor = vec4(result, 1.0);
}
