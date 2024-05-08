import { gl } from ".";
import { isPowerOf2 } from "./MathUtilities";

export class Texture {
    public readonly texture: WebGLTexture;

    public constructor(imageUrl: string, flipTexture = false) {
        this.texture = gl.createTexture();
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        const image = new Image();
        image.onload = () => {
            this.bind();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            this.unbind();
        };
        image.src = imageUrl;
    }

    public bind() {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    public unbind() {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public activate(textureIndex = 0) {
        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        this.bind();
    }

    public delete() {
        gl.deleteTexture(this.texture);
    }
}