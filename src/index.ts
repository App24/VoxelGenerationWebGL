import { mat4, vec3 } from "gl-matrix";
import { BufferObject } from "./BufferObject";
import { ShaderProgram } from "./ShaderProgram";
import { toRadians } from "./MathUtilities";
import { Camera } from "./Camera";
import { Texture } from "./Texture";
import { keyboard } from "./Keyboard";
import { Key } from "ts-key-enum";
import Chunk, { CHUNK_D, CHUNK_H, CHUNK_W } from "./Chunk";
import { createMesh, generateChunkMesh } from "./MeshGenerator";
import { World } from "./World";

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
    const program2 = new ShaderProgram("resources/shaders/test.vs", "resources/shaders/light.fs");

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

    const chunkShader = new ShaderProgram("resources/shaders/chunk.vs", "resources/shaders/chunk.fs");

    const chunk = new Chunk();
    chunk.position = [0, 0, 0];

    const chunk2 = new Chunk();
    chunk2.position = [1, 0, 0];

    const world = new World();
    world.chunks.push(chunk);
    world.chunks.push(chunk2);

    const chunksMeshData = createMesh(world);

    const chunkRendering: { vao: WebGLVertexArrayObject, vbo: BufferObject, vboNormals: BufferObject, ebo: BufferObject, position: vec3, indicesCount: number }[] = [];

    chunksMeshData.forEach(chunkMeshData => {
        const chunkVerticesArray = new Float32Array(chunkMeshData.vertices);
        const chunkIndicesArray = new Int32Array(chunkMeshData.indices);
        const chunkNormalsArray = new Float32Array(chunkMeshData.normals);

        const chunkVao = gl.createVertexArray();
        const chunkVbo = new BufferObject(gl.ARRAY_BUFFER);
        const chunkVboNormals = new BufferObject(gl.ARRAY_BUFFER);
        const chunkEbo = new BufferObject(gl.ELEMENT_ARRAY_BUFFER);

        gl.bindVertexArray(chunkVao);
        chunkVbo.setData(chunkVerticesArray, gl.STATIC_DRAW);
        chunkVbo.bind();
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        chunkVbo.unbind();

        chunkVboNormals.setData(chunkNormalsArray, gl.STATIC_DRAW);
        chunkVboNormals.bind();
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);
        chunkVboNormals.unbind();

        chunkEbo.setData(chunkIndicesArray, gl.STATIC_DRAW);

        chunkRendering.push({ vao: chunkVao, vbo: chunkVbo, vboNormals: chunkVboNormals, ebo: chunkEbo, position: chunkMeshData.chunk.position, indicesCount: chunkMeshData.indices.length });
    });

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
        program2.setMatrix4fv("projectionMatrix", projectionMatrix);
        chunkShader.setMatrix4fv("projectionMatrix", projectionMatrix);
    });

    let modelMatrix = mat4.create();
    modelMatrix = mat4.translate(modelMatrix, modelMatrix, [0, 0, -10]);
    modelMatrix = mat4.scale(modelMatrix, modelMatrix, [5, 5, 5]);

    const camera = new Camera();

    program.setMatrix4fv("projectionMatrix", projectionMatrix);
    program2.setMatrix4fv("projectionMatrix", projectionMatrix);
    chunkShader.setMatrix4fv("projectionMatrix", projectionMatrix);
    program.setMatrix4fv("modelMatrix", modelMatrix);

    const lightColor = vec3.fromValues(1, 1, 1);

    program.setVec3("objectColor", [1, .8, .3]);
    chunkShader.setVec3("objectColor", [1, 1, 1]);
    program.setVec3("lightColor", lightColor);
    chunkShader.setVec3("lightColor", lightColor);
    program2.setVec3("lightColor", lightColor);
    chunkShader.setVec3("lightPos", [5, 20, 18]);

    program.setFloat("specularStrength", 0.25);
    const delta = 60 / 1000;

    let angle = 0;

    let lightPos = vec3.create();

    function run() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        modelMatrix = mat4.rotateY(modelMatrix, modelMatrix, toRadians(5) * delta);
        program.setMatrix4fv("modelMatrix", modelMatrix);
        program.setMatrix4fv("viewMatrix", camera.viewMatrix);
        program2.setMatrix4fv("viewMatrix", camera.viewMatrix);
        program.setVec3("viewPos", camera.position);
        chunkShader.setVec3("viewPos", camera.position);
        chunkShader.setMatrix4fv("viewMatrix", camera.viewMatrix);

        angle += 5 * delta;

        angle = angle % 360;

        lightPos = [5 * Math.sin(toRadians(angle)), 5 * Math.cos(toRadians(angle)), 5 * Math.sin(toRadians(angle / 2)) - 10];

        program.setVec3("lightPos", lightPos);

        chunkRendering.forEach(chunkData => {
            const chunkModelMatrix = mat4.create();
            mat4.translate(chunkModelMatrix, chunkModelMatrix, vec3.mul(vec3.create(), [CHUNK_W / 2, CHUNK_H / 2, CHUNK_D / 2], chunkData.position));
            chunkShader.setMatrix4fv("modelMatrix", chunkModelMatrix);
            chunkShader.use();
            gl.bindVertexArray(chunkData.vao);
            chunkData.ebo.bind();
            gl.drawElements(gl.TRIANGLES, chunkData.indicesCount, gl.UNSIGNED_INT, 0);
        });

        program.use();
        gl.bindVertexArray(vao);
        indicesBuffer.bind();
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);

        const lightPosModelMatrix = mat4.create();
        mat4.translate(lightPosModelMatrix, lightPosModelMatrix, lightPos);
        program2.setMatrix4fv("modelMatrix", lightPosModelMatrix);
        program2.use();
        gl.bindVertexArray(vao);
        indicesBuffer.bind();
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);

        let movement: vec3 = vec3.create();

        if (keyboard.isKeyDown("w")) {
            movement[2] = -2;
        } else if (keyboard.isKeyDown("s")) {
            movement[2] = 2;
        }

        if (keyboard.isKeyDown("a")) {
            movement[0] = -2;
        } else if (keyboard.isKeyDown("d")) {
            movement[0] = 2;
        }

        if (keyboard.isKeyDown(" ")) {
            movement[1] = 2;
        } else if (keyboard.isKeyDown(Key.Shift)) {
            movement[1] = -2;
        }

        if (keyboard.isKeyDown("q")) {
            camera.yaw -= 20 * delta;
        } else if (keyboard.isKeyDown("e")) {
            camera.yaw += 20 * delta;
        }

        movement = vec3.normalize(movement, movement);
        camera.position = vec3.add(vec3.create(), camera.position, vec3.multiply(vec3.create(), movement, [delta, delta, delta]));
    }

    function clearData() {
        program.delete();
        program2.delete();
        verticesBuffer.delete();
        indicesBuffer.delete();
        normalsBuffer.delete();
        texture.delete();
        chunkShader.delete();
        chunkRendering.forEach(chunkData => {
            chunkData.vbo.delete();
            chunkData.ebo.delete();
            chunkData.vboNormals.delete();
            gl.deleteVertexArray(chunkData.vao);
        });
        gl.deleteVertexArray(vao);
    }
})();