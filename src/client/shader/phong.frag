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

uniform Material uMaterial;
uniform Light uLight;
uniform bool uUseNormalMap;
uniform lowp vec2 uDepthMapScale;

varying lowp vec3 vFragPos;
varying lowp vec2 vTexCoord;
varying lowp mat3 vTangent;
varying lowp vec3 vTangentViewPos;
varying lowp vec3 vTangentFragPos;

lowp vec2 depthMap(sampler2D depthMap, lowp vec2 texCoords, lowp vec3 viewDir) {
  lowp float angle = min(1.0, abs(dot(vec3(0.0, 0.0, 1.0), viewDir)) * uDepthMapScale.y);
  lowp float height = 1.0 - texture2D(depthMap, texCoords).r * 2.0;
  lowp vec2 p = viewDir.xy / viewDir.z * (height * uDepthMapScale.x * angle);
  return texCoords - p;
  /*
  const lowp float minLayers = 1.0;
  const lowp float maxLayers = 16.0;
  lowp float numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0.0, 0.0, 1.0), viewDir)));
  lowp float layerDepth = 1.0 / numLayers;
  lowp float currentLayerDepth = 0.0;
  lowp vec2 P = viewDir.xy / viewDir.z * uDepthMapScale;
  lowp vec2 deltaTexCoords = P / numLayers;
  lowp vec2 currentTexCoords = texCoords;
  lowp float currentDepthMapValue = 1.0 - texture2D(depthMap, texCoords).r * 2.0;
  for (int i = 0; i < 32; ++i) {
    // shift texture coordinates along direction of P
    currentTexCoords -= deltaTexCoords;
    // get depthmap value at current texture coordinates
    currentDepthMapValue = 1.0 - texture2D(depthMap, texCoords).r * 2.0;
    // get depth of next layer
    currentLayerDepth += layerDepth;
    if (currentLayerDepth >= currentDepthMapValue) break;
  }
  lowp vec2 prevTexCoords = currentTexCoords + deltaTexCoords;
  lowp float afterDepth  = currentDepthMapValue - currentLayerDepth;
  lowp float beforeDepth = (1.0 - texture2D(depthMap, texCoords).r * 2.0) - currentLayerDepth + layerDepth;
  lowp float weight = afterDepth / (afterDepth - beforeDepth);
  lowp vec2 finalTexCoords = prevTexCoords * weight + currentTexCoords * (1.0 - weight);

  return finalTexCoords;
  */
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

  lowp vec3 lightDir =
    vTangent * uLight.position.xyz - vTangentFragPos * uLight.position.w;
  lowp float distance = length(lightDir);
  lightDir = lightDir / distance;

  lowp float attenuation = 1.0 / ( 1.0 +
    uLight.attenuation * (distance * distance) * uLight.position.w);

  lowp float lambertian = max(dot(lightDir, normal), 0.0);
  lowp float spec = 0.0;
  if (lambertian > 0.0) {
    lowp vec3 halfDir = normalize(lightDir + viewDir);
    lowp float specAngle = max(dot(halfDir, normal), 0.0);

    spec = pow(specAngle, uMaterial.shininess);
  }

  lowp float alpha = 1.0;

  lowp vec3 ambient;
  if (uMaterial.ambient.x == -1.0) {
    ambient = texture2D(uMaterial.diffuseMap, texCoord).xyz;
  } else {
    ambient = uMaterial.ambient;
  }
  ambient *= uLight.ambient;

  lowp vec3 diffuse;
  if (uMaterial.diffuse.x == -1.0) {
    lowp vec4 texture = texture2D(uMaterial.diffuseMap, texCoord);
    diffuse = texture.xyz;
    // alpha = texture.w;
  } else {
    diffuse = uMaterial.diffuse;
  }
  diffuse *= lambertian * uLight.diffuse;

  lowp vec3 specular;
  if (uMaterial.specular.x == -1.0) {
    specular = texture2D(uMaterial.specularMap, texCoord).xyz;
  } else {
    specular = uMaterial.specular;
  }
  specular *= spec * uLight.specular;

  if (uLight.coneCutOff.y > 0.0) {
    lowp float theta = dot(lightDir, normalize(vTangent * -uLight.coneDirection));
    lowp float epsilon = uLight.coneCutOff.x - uLight.coneCutOff.y;
    lowp float intensity = clamp((theta - uLight.coneCutOff.y) / epsilon,
      0.0, 1.0);
    diffuse *= intensity;
    specular *= intensity;
  }

  lowp vec3 result = (ambient + diffuse + specular) * attenuation;
  gl_FragColor = vec4(result, alpha);
}
