import { vec3 } from "gl-matrix";

export const CHUNK_W = 16;
export const CHUNK_H = 16;
export const CHUNK_D = 16;

export default class Chunk {
    public voxels: number[];
    public position: vec3 = [0, 0, 0];

    public constructor() {
        this.voxels = new Array(CHUNK_W * CHUNK_H * CHUNK_D).fill(0);

        for (let y = 0; y < 10; y++) {
            for (let z = 0; z < CHUNK_D; z++) {
                for (let x = 0; x < CHUNK_W; x++) {
                    if (y == 9)
                        this.voxels[(z * CHUNK_W * CHUNK_H) + (y * CHUNK_W) + x] = 3;
                    else if (y >= 6)
                        this.voxels[(z * CHUNK_W * CHUNK_H) + (y * CHUNK_W) + x] = 2;
                    else
                        this.voxels[(z * CHUNK_W * CHUNK_H) + (y * CHUNK_W) + x] = 1;
                }
            }
        }

        this.voxels[(5 * CHUNK_W * CHUNK_H) + (10 * CHUNK_W) + 4] = 3;
    }

    public getVoxel(x: number, y: number, z: number) {
        if (x < 0 || x >= CHUNK_W || y < 0 || z < 0 || y >= CHUNK_H || z >= CHUNK_D) return 0;
        return this.voxels[(z * CHUNK_W * CHUNK_H) + (y * CHUNK_W) + x];
    }
}