attribute lowp vec3 aPosition;

uniform lowp mat4 uTransform;

varying lowp vec3 vTexCoord;

void main(void) {
  lowp vec4 pos = uTransform * vec4(aPosition, 1.0);
  gl_Position = pos.xyww;
  vTexCoord = aPosition;
}
