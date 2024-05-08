precision highp float;

varying highp vec3 FragPos;
varying highp vec3 Normal;

uniform vec3 objectColor;
uniform vec3 lightPos;
uniform vec3 viewPos;
uniform vec3 lightColor;

void main(){
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

        // Diffuse
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    vec3 finalColor = (ambient + diffuse) * objectColor;

    gl_FragColor = vec4(finalColor, 1);
}