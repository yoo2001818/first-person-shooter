attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aTangent;
attribute vec2 aTexCoord;

uniform mat4 uTransform;
uniform mat4 uModel;
uniform mat3 uModelInvTransp;
uniform bool uUseNormalMap;

varying lowp vec3 vFragPos;
varying lowp vec3 vNormal;
varying lowp vec2 vTexCoord;
varying lowp mat3 vTangent;

void main(void) {
  gl_Position = uTransform * vec4(aPosition, 1.0);
  // vColor = aNormal * 0.5 + 0.5;
  vFragPos = vec3(uModel * vec4(aPosition, 1.0));
  vNormal = normalize(uModelInvTransp * aNormal);
  // OpenGL's Y axis is inverted... not sure why though.
  vTexCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);
  if (uUseNormalMap) {
    vec3 T = normalize(vec3(uModel * vec4(aTangent, 0.0)));
    vec3 N = normalize(vec3(uModel * vec4(aNormal, 0.0)));
    vec3 B = cross(T, N);
    vTangent = mat3(T, B, N);
  }
}
