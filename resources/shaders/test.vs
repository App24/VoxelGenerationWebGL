attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying highp vec3 FragPos;
varying highp vec3 Normal;
varying highp vec2 TexCoord;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPos, 1);
    FragPos = vec3(modelMatrix * vec4(aPos, 1.0));
    Normal = mat3(modelMatrix) * aNormal;
    TexCoord = aTexCoord;
}