attribute vec3 aPosition;

uniform mat4 uTransform;

uniform lowp vec3 uColor;

void main(void) {
  gl_Position = uTransform * vec4(aPosition, 1.0);
}
