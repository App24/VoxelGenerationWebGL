import { vec3 } from "gl-matrix";
import Chunk from "./Chunk";

export class World {
    public chunks: Chunk[] = [];

    public getChunk(x: number, y: number, z: number) {
        return this.chunks.find(c => vec3.equals(c.position, [x, y, z]));
    }

    public getChunkVec(pos: vec3) {
        return this.getChunk(pos[0], pos[1], pos[2]);
    }
}