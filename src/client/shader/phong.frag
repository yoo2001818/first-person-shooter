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
  sampler2D depthMap;
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

const int LIGHT_SIZE = 8;

uniform Material uMaterial;
uniform Light uLight[LIGHT_SIZE];
uniform int uLightSize;
uniform bool uUseNormalMap;
uniform lowp vec2 uDepthMapScale;

varying lowp vec2 vTexCoord;
varying lowp mat3 vTangent;
varying lowp vec3 vTangentViewPos;
varying lowp vec3 vTangentFragPos;

lowp vec2 depthMap(sampler2D depthMap, lowp vec2 texCoords, lowp vec3 viewDir) {
  lowp float angle = min(1.0, abs(dot(vec3(0.0, 0.0, 1.0), viewDir)) * uDepthMapScale.y);
  lowp float height = 1.0 - texture2D(depthMap, texCoords).r * 2.0;
  lowp vec2 p = viewDir.xy / viewDir.z * (height * uDepthMapScale.x * angle);
  return texCoords - p;
}

lowp vec3 calcLight(Light light, lowp vec3 viewDir, lowp vec3 normal,
  lowp vec3 ambient, lowp vec3 diffuse, lowp vec3 specular
) {
  lowp vec3 lightDir = vTangent * light.position.xyz -
    vTangentFragPos * light.position.w;

  lowp float distance = length(lightDir);
  lightDir = lightDir / distance;

  // Attenuation
  lowp float attenuation = 1.0 / ( 1.0 +
    light.attenuation * (distance * distance) * light.position.w);

  // Diffuse
  lowp float lambertian = max(dot(lightDir, normal), 0.0);

  // Specular
  lowp float spec = 0.0;
  if (lambertian > 0.0) {
    lowp vec3 halfDir = normalize(lightDir + viewDir);
    lowp float specAngle = max(dot(halfDir, normal), 0.0);

    spec = pow(specAngle, uMaterial.shininess);
  }

  // Spotlight
  lowp float intensity = 1.0;
  if (light.coneCutOff.y > 0.0) {
    lowp float theta = dot(lightDir, normalize(vTangent * -light.coneDirection));
    lowp float epsilon = light.coneCutOff.x - light.coneCutOff.y;
    intensity = clamp((theta - light.coneCutOff.y) / epsilon,
      0.0, 1.0);
  }

  // Combine everything together
  lowp vec3 result = diffuse * light.diffuse * lambertian;
  result += specular * light.specular * spec;
  result *= intensity;
  result += ambient * light.ambient;
  result *= attenuation;

  return result;
}

void main(void) {
  lowp vec3 viewDir = normalize(vTangentViewPos - vTangentFragPos);
  lowp vec3 normal = vec3(0.0, 0.0, 1.0);
  lowp vec2 texCoord = vTexCoord;
  if (uDepthMapScale.x != 0.0) {
    texCoord = depthMap(uMaterial.depthMap, vTexCoord, viewDir);
    if (texCoord.x > 1.0 || texCoord.y > 1.0 ||
      texCoord.x < 0.0 || texCoord.y < 0.0
    ) {
      discard;
    }
  }
  if (uUseNormalMap) {
    normal = texture2D(uMaterial.normalMap, texCoord).xyz;
    // Again, OpenGL uses inverted Y axis, so we need to invert this as well.
    normal.y = 1.0 - normal.y;
    normal = normalize(normal * 2.0 - 1.0);
  }

  lowp float alpha = 1.0;
  lowp vec3 ambient, diffuse, specular;

  if (uMaterial.ambient.x == -1.0) {
    ambient = texture2D(uMaterial.diffuseMap, texCoord).xyz;
  } else {
    ambient = uMaterial.ambient;
  }

  if (uMaterial.diffuse.x == -1.0) {
    lowp vec4 texture = texture2D(uMaterial.diffuseMap, texCoord);
    diffuse = texture.xyz;
    // alpha = texture.w;
  } else {
    diffuse = uMaterial.diffuse;
  }

  if (uMaterial.specular.x == -1.0) {
    specular = texture2D(uMaterial.specularMap, texCoord).xyz;
  } else {
    specular = uMaterial.specular;
  }

  lowp vec3 result = vec3(0.0, 0.0, 0.0);
  for (int i = 0; i < LIGHT_SIZE; ++i) {
    // Not sure if using break is good idea
    if (i >= uLightSize) break;
    result += calcLight(uLight[i], viewDir, normal, ambient, diffuse, specular);
  }

  gl_FragColor = vec4(result, alpha);
}
