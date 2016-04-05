attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjectionMat;
uniform vec3 uOffset;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition + uOffset, 1.0);
  vTextureCoord = aTextureCoord;
}
