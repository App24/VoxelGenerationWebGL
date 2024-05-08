import { ReadonlyVec3, mat4, vec3 } from "gl-matrix";
import { toRadians } from "./MathUtilities";

export class Camera {
    private _position: vec3;
    private _yaw: number;
    private _pitch: number;

    private _viewMatrix: mat4;

    private recreateMatrix: boolean;

    public constructor() {
        this._position = [0, 0, 0];
        this._yaw = -90;
        this._pitch = 0;
        this.recreateMatrix = true;
    }

    private recreateViewMatrix() {
        this.recreateMatrix = false;
        this._viewMatrix = mat4.create();
        let direction = vec3.create();
        direction[0] = Math.cos(toRadians(this._yaw)) * Math.cos(toRadians(this._pitch));
        direction[1] = Math.sin(toRadians(this._pitch));
        direction[2] = Math.sin(toRadians(this._yaw)) * Math.cos(toRadians(this._pitch));
        direction = vec3.normalize(direction, direction);
        let temp = vec3.create();
        temp = vec3.add(temp, this._position, direction);
        this._viewMatrix = mat4.lookAt(this._viewMatrix, this._position, temp, [0, 1, 0]);
    }

    public get viewMatrix() {
        if (this.recreateMatrix)
            this.recreateViewMatrix();
        return this._viewMatrix;
    }

    public get position(): ReadonlyVec3 {
        return this._position;
    }

    public set position(value: vec3) {
        this._position = value;
        this.recreateMatrix = true;
    }

    public get positionX(){
        return this._position[0];
    }

    public get positionY(){
        return this._position[1];
    }

    public get positionZ(){
        return this._position[2];
    }

    public set positionX(value: number) {
        this._position[0] = value;
        this.recreateMatrix = true;
    }

    public set positionY(value: number) {
        this._position[1] = value;
        this.recreateMatrix = true;
    }

    public set positionZ(value: number) {
        this._position[2] = value;
        this.recreateMatrix = true;
    }

    public set yaw(value: number) {
        this._yaw = value;
        this.recreateMatrix = true;
    }

    public set pitch(value: number) {
        this._pitch = value;
        this.recreateMatrix = true;
    }

    public get yaw() {
        return this._yaw;
    }

    public get pitch() {
        return this._pitch;
    }
}