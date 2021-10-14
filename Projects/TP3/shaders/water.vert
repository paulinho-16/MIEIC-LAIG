attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D waterMap;
uniform sampler2D waterTex;

uniform float timeFactor;

uniform float normScale;

void main() {
    vec3 offset = vec3(0.0, 0.0, 0.0);

    // Waves movement
    vec4 filter = texture2D(waterMap, aTextureCoord + timeFactor*(0.01, 0.01));

    offset = aVertexNormal * filter.b * 0.1;

    if(filter.b > 0.5)
      offset = 0.045 * aVertexNormal;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

    vTextureCoord = aTextureCoord;
}