import { ReadonlyVec3, mat4 } from "gl-matrix";
import { gl } from ".";
import { loadFile } from "./Utilities";

export class ShaderProgram {
    public program: WebGLProgram;

    public constructor(vertexShaderFile: string, fragmentShaderFile: string) {
        const vertexShader = this.createShader(gl.VERTEX_SHADER, loadFile(vertexShaderFile));
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, loadFile(fragmentShaderFile));

        this.program = gl.createProgram();

        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(this.program);
            this.delete();
            throw new Error(`Failed to link program. Log: ${log}`);
        }
    }

    private createShader(shaderType: number, shaderSource: string) {
        const shader = gl.createShader(shaderType);

        gl.shaderSource(shader, shaderSource);

        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader);

            gl.deleteShader(shader);
            throw new Error(`Could not compile shader type: '${shaderType}'. Log: ${log}`);
            return null;
        }

        return shader;
    }

    public use() {
        gl.useProgram(this.program);
    }

    public unuse() {
        gl.useProgram(null);
    }

    public delete() {
        gl.deleteProgram(this.program);
    }

    public setMatrix4fv(uniformName: string, matrix: mat4) {
        this.use();
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, uniformName), false, matrix, 0, 0);
        this.unuse();
    }

    public setInt(uniformName: string, value: number) {
        this.use();
        gl.uniform1i(gl.getUniformLocation(this.program, uniformName), value);
        this.unuse();
    }

    public setFloat(uniformName: string, value: number) {
        this.use();
        gl.uniform1f(gl.getUniformLocation(this.program, uniformName), value);
        this.unuse();
    }

    public setVec3(uniformName: string, value: ReadonlyVec3) {
        this.use();
        gl.uniform3f(gl.getUniformLocation(this.program, uniformName), value[0], value[1], value[2]);
        this.unuse();
    }
}