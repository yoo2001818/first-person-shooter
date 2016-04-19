attribute vec2 aPosition;

varying lowp vec3 vColor;

uniform mat4 uTransform;

uniform lowp vec3 uColor;
uniform lowp vec3 uHoriColor;
uniform lowp vec3 uVertColor;

void main(void) {
  gl_Position = uTransform * vec4(aPosition, 0.0, 1.0);
  if (aPosition.y == 0.0) {
    vColor = uHoriColor;
  } else if (aPosition.x == 0.0) {
    vColor = uVertColor;
  } else {
    vColor = uColor;
  }
}
