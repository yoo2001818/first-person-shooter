// varying highp vec2 vTextureCoord;
varying lowp vec3 vColor;

// uniform sampler2D uTexture;

void main(void) {
  // gl_FragColor = texture2D(uTexture, vec2(vTextureCoord.s, 1.0 - vTextureCoord.t));
  // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  gl_FragColor = vec4(vColor, 1.0);
}
