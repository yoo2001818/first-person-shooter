attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aTangent;
attribute vec2 aTexCoord;

struct Light {
  lowp vec4 position;

  lowp vec3 ambient;
  lowp vec3 diffuse;
  lowp vec3 specular;

  lowp float attenuation;

  lowp vec2 coneCutOff;
  lowp vec3 coneDirection;
};

uniform Light uLight;
uniform lowp vec3 uViewPos;
uniform mat4 uTransform;
uniform mat4 uModel;
uniform mat3 uModelInvTransp;

varying lowp vec3 vFragPos;
varying lowp vec3 vNormal;
varying lowp vec2 vTexCoord;
varying lowp mat3 vTangent;
varying lowp vec3 vTangentViewPos;
varying lowp vec3 vTangentFragPos;

void main(void) {
  gl_Position = uTransform * vec4(aPosition, 1.0);
  // vColor = aNormal * 0.5 + 0.5;
  vFragPos = vec3(uModel * vec4(aPosition, 1.0));
  vNormal = normalize(uModelInvTransp * aNormal);
  // OpenGL's Y axis is inverted... not sure why though.
  vTexCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);
  lowp vec3 T = normalize(vec3(uModelInvTransp * aTangent));
  lowp vec3 N = vNormal;
  lowp vec3 B = cross(T, N);
  // lowp mat3 tangent = transpose(mat3(T, B, N));
  // Transpose the matrix by hand
  lowp mat3 tangent = mat3(
    vec3(T.x, B.x, N.x),
    vec3(T.y, B.y, N.y),
    vec3(T.z, B.z, N.z)
  );
  vTangent = tangent;
  vTangentViewPos = tangent * uViewPos;
  vTangentFragPos = tangent * vFragPos;
}
