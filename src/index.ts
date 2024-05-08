import { mat4 } from "gl-matrix";
import { BufferObject } from "./BufferObject";
import { ShaderProgram } from "./ShaderProgram";
import { toRadians } from "./MathUtilities";
import { Camera } from "./Camera";
import { Texture } from "./Texture";
import { keyboard } from "./Keyboard";
import { Key } from "ts-key-enum";

export let gl: WebGL2RenderingContext;

(() => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl = canvas.getContext("webgl2");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    document.body.appendChild(canvas);

    gl.clearColor(0.2, 0.3, 0.3, 1);

    setInterval(() => run(), 1000 / 60);
    addEventListener("close", clearData);

    const program = new ShaderProgram("resources/shaders/test.vs", "resources/shaders/test.fs");

    const verticesData = [
        // Front face
        -0.5, -0.5, 0.5,  // Bottom-left
        0.5, -0.5, 0.5,  // Bottom-right
        0.5, 0.5, 0.5,  // Top-right
        -0.5, 0.5, 0.5,  // Top-left 
        // Back face
        -0.5, -0.5, -0.5,  // Bottom-left
        0.5, -0.5, -0.5,  // Bottom-right
        0.5, 0.5, -0.5,  // Top-right
        -0.5, 0.5, -0.5,  // Top-left 
        // Left face
        -0.5, 0.5, 0.5,  // Top-right
        -0.5, -0.5, 0.5,  // Bottom-right
        -0.5, -0.5, -0.5,  // Bottom-left
        -0.5, 0.5, -0.5,  // Top-left 
        // Right face
        0.5, 0.5, 0.5,  // Top-left
        0.5, -0.5, 0.5,  // Bottom-left
        0.5, -0.5, -0.5,  // Bottom-right
        0.5, 0.5, -0.5,  // Top-right 
        // Top face
        -0.5, 0.5, 0.5,  // Top-left
        0.5, 0.5, 0.5,  // Top-right
        0.5, 0.5, -0.5,  // Bottom-right
        -0.5, 0.5, -0.5,  // Bottom-left 
        // Bottom face
        -0.5, -0.5, 0.5,  // Top-right
        0.5, -0.5, 0.5,  // Top-left
        0.5, -0.5, -0.5,  // Bottom-left
        -0.5, -0.5, -0.5   // Bottom-right
    ];

    const indices = [
        0, 1, 2, 2, 3, 0,       // Front face
        6, 5, 4, 4, 7, 6,       // Back face
        10, 9, 8, 8, 11, 10,    // Left face
        12, 13, 14, 14, 15, 12, // Right face
        16, 17, 18, 18, 19, 16, // Top face
        22, 21, 20, 20, 23, 22  // Bottom face
    ];

    const normals = [
        // Front face
        0.0, 0.0, 1.0,  // Bottom-left
        0.0, 0.0, 1.0,  // Bottom-right
        0.0, 0.0, 1.0,  // Top-right
        0.0, 0.0, 1.0,  // Top-left 
        // Back face
        0.0, 0.0, -1.0,  // Bottom-left
        0.0, 0.0, -1.0,  // Bottom-right
        0.0, 0.0, -1.0,  // Top-right
        0.0, 0.0, -1.0,  // Top-left 
        // Left face
        -1.0, 0.0, 0.0,  // Top-right
        -1.0, 0.0, 0.0,  // Bottom-right
        -1.0, 0.0, 0.0,  // Bottom-left
        -1.0, 0.0, 0.0,  // Top-left 
        // Right face
        1.0, 0.0, 0.0,  // Top-left
        1.0, 0.0, 0.0,  // Bottom-left
        1.0, 0.0, 0.0,  // Bottom-right
        1.0, 0.0, 0.0,  // Top-right 
        // Top face
        0.0, 1.0, 0.0,  // Top-left
        0.0, 1.0, 0.0,  // Top-right
        0.0, 1.0, 0.0,  // Bottom-right
        0.0, 1.0, 0.0,  // Bottom-left 
        // Bottom face
        0.0, -1.0, 0.0,  // Top-right
        0.0, -1.0, 0.0,  // Top-left
        0.0, -1.0, 0.0,  // Bottom-left
        0.0, -1.0, 0.0   // Bottom-right
    ];

    const uvs = [
        // Front face
        0.0, 0.0,  // Bottom-left
        1.0, 0.0,  // Bottom-right
        1.0, 1.0,  // Top-right
        0.0, 1.0,  // Top-left 
        // Back face
        1.0, 0.0,  // Bottom-right
        0.0, 0.0,  // Bottom-left
        0.0, 1.0,  // Top-left 
        1.0, 1.0,  // Top-right
        // Left face
        1.0, 1.0,  // Bottom-left
        1.0, 0.0,  // Bottom-right
        0.0, 0.0,  // Top-right
        0.0, 1.0,  // Top-left 
        // Right face
        0.0, 1.0,  // Top-right 
        0.0, 0.0,  // Top-left
        1.0, 0.0,  // Bottom-left
        1.0, 1.0,  // Bottom-right
        // Top face
        0.0, 0.0,  // Top-left
        1.0, 0.0,  // Top-right
        1.0, 1.0,  // Bottom-right
        0.0, 1.0,  // Bottom-left 
        // Bottom face
        0.0, 0.0,  // Top-right
        1.0, 0.0,  // Top-left
        1.0, 1.0,  // Bottom-left
        0.0, 1.0   // Bottom-right
    ];

    const verticesArray = new Float32Array(verticesData);
    const indicesArray = new Int32Array(indices);
    const normalsArray = new Float32Array(normals);
    const uvsArray = new Float32Array(uvs);

    const vao = gl.createVertexArray();
    const verticesBuffer = new BufferObject(gl.ARRAY_BUFFER);
    const indicesBuffer = new BufferObject(gl.ELEMENT_ARRAY_BUFFER);
    const normalsBuffer = new BufferObject(gl.ARRAY_BUFFER);
    const uvsBuffer = new BufferObject(gl.ARRAY_BUFFER);

    gl.bindVertexArray(vao);

    verticesBuffer.setData(verticesArray, gl.STATIC_DRAW);
    verticesBuffer.bind();
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    verticesBuffer.unbind();

    normalsBuffer.setData(normalsArray, gl.STATIC_DRAW);
    normalsBuffer.bind();
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);
    normalsBuffer.unbind();

    uvsBuffer.setData(uvsArray, gl.STATIC_DRAW);
    uvsBuffer.bind();
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(2);
    uvsBuffer.unbind();

    indicesBuffer.setData(indicesArray, gl.STATIC_DRAW);

    gl.bindVertexArray(null);

    const texture = new Texture("resources/textures/sand.png", true);

    let projectionMatrix = mat4.create();
    projectionMatrix = mat4.perspective(projectionMatrix, toRadians(60), canvas.clientWidth / canvas.clientHeight, 0.1, 100);

    addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl = canvas.getContext("webgl2");
        gl.viewport(0, 0, canvas.width, canvas.height);
        projectionMatrix = mat4.create();
        projectionMatrix = mat4.perspective(projectionMatrix, toRadians(60), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        program.setMatrix4fv("projectionMatrix", projectionMatrix);
    });

    let modelMatrix = mat4.create();
    modelMatrix = mat4.translate(modelMatrix, modelMatrix, [0, 0, -10]);
    modelMatrix = mat4.scale(modelMatrix, modelMatrix, [5,5,5]);

    const camera = new Camera();

    program.setMatrix4fv("projectionMatrix", projectionMatrix);
    program.setMatrix4fv("modelMatrix", modelMatrix);

    program.setVec3("objectColor", [1, 1, 1]);
    program.setVec3("lightColor", [1, 1, 1]);
    program.setVec3("viewPos", camera.position);
    program.setVec3("lightPos", [5, 1, 2]);

    program.setFloat("specularStrength", 0.25);
    const delta = 60 / 1000;

    function run() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        modelMatrix = mat4.rotateY(modelMatrix, modelMatrix, toRadians(5) * delta);
        program.setMatrix4fv("modelMatrix", modelMatrix);
        program.setMatrix4fv("viewMatrix", camera.viewMatrix);

        program.use();
        gl.bindVertexArray(vao);
        indicesBuffer.bind();
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);

        if(keyboard.isKeyDown("w")){
            camera.positionZ -= 2 * delta;
        }else if(keyboard.isKeyDown("s")){
            camera.positionZ += 2 * delta;
        }

        if(keyboard.isKeyDown("a")){
            camera.positionX -= 2 * delta;
        }else if(keyboard.isKeyDown("d")){
            camera.positionX += 2 * delta;
        }

        if(keyboard.isKeyDown(" ")){
            camera.positionY += 2 * delta;
        }else if(keyboard.isKeyDown(Key.Shift)){
            camera.positionY -= 2 * delta;
        }
    }

    function clearData() {
        program.delete();
        verticesBuffer.delete();
        indicesBuffer.delete();
        normalsBuffer.delete();
        texture.delete();
        gl.deleteVertexArray(vao);
    }
})();