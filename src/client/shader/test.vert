attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aTextureCoord;

uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjectionMat;
uniform vec4 uVertexColor;

varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition, 1.0);
  vColor = vec4(aVertexColor, 1.0);
  vTextureCoord = aTextureCoord;
}
