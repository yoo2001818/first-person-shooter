varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

uniform sampler2D uTexture;

void main(void) {
  gl_FragColor = texture2D(uTexture, vec2(vTextureCoord.s, 1.0 - vTextureCoord.t));
}
