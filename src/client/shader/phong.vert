attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uTransform;
uniform mat4 uModel;
uniform mat3 uModelInvTransp;

uniform lowp vec3 uObjectColor;
uniform lowp vec3 uLightColor;
uniform lowp vec3 uLightPos;

varying lowp vec3 vFragPos;
varying lowp vec3 vNormal;

void main(void) {
  gl_Position = uTransform * vec4(aPosition, 1.0);
  // vColor = aNormal * 0.5 + 0.5;
  vFragPos = vec3(uModel * vec4(aPosition, 1.0));
  vNormal = normalize(uModelInvTransp * aNormal);
}
