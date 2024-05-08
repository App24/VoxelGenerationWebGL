import { gl } from ".";

export class BufferObject {
    public readonly bufferType: number;

    public get buffer(){
        return this._buffer;
    }

    private _buffer: WebGLBuffer;

    public constructor(bufferType: number) {
        this.bufferType = bufferType;
        this.recreate();
    }

    public setData(data: AllowSharedBufferSource, usage: number) {
        if (!this._buffer) return this;

        this.bind();

        gl.bufferData(this.bufferType, data, usage);

        this.unbind();

        return this;
    }

    public bind() {
        if (!this._buffer) return this;

        gl.bindBuffer(this.bufferType, this._buffer);

        return this;
    }

    public unbind() {
        if (!this._buffer) return this;

        gl.bindBuffer(this.bufferType, null);

        return this;
    }

    public recreate() {
        if (this._buffer) return this;

        this._buffer = gl.createBuffer();

        return this;
    }

    public delete() {
        if (!this._buffer) return;

        gl.deleteBuffer(this._buffer);
        this._buffer = null;
    }
}