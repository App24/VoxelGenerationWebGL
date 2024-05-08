import { vec3 } from "gl-matrix";
import Chunk, { CHUNK_D, CHUNK_H, CHUNK_W } from "./Chunk";
import { World } from "./World";

function hasVoxel(world: World, chunk: Chunk, x: number, y: number, z: number) {
    if (x < 0 || x >= CHUNK_W || y < 0 || z < 0 || y >= CHUNK_H || z >= CHUNK_D) {
        const sidePos: vec3 = vec3.create();
        sidePos[0] = x < 0 ? -1 : (x >= CHUNK_W ? 1 : 0);
        sidePos[1] = y < 0 ? -1 : (y >= CHUNK_H ? 1 : 0);
        sidePos[2] = z < 0 ? -1 : (z >= CHUNK_D ? 1 : 0);
        const sideChunk = world.getChunkVec(vec3.add(vec3.create(), chunk.position, sidePos));
        if (!sideChunk) return false;

        if (sidePos[0] == -1)
            x += CHUNK_W;
        else if (sidePos[0] == 1)
            x -= CHUNK_W;

        if (sidePos[1] == -1)
            y += CHUNK_H;
        else if (sidePos[1] == 1)
            y -= CHUNK_H;

        if (sidePos[2] == -1)
            z += CHUNK_D;
        else if (sidePos[2] == 1)
            z -= CHUNK_D;

        return hasVoxel(world, sideChunk, x, y, z);
    }
    return chunk.getVoxel(x, y, z) != 0;
}

export function generateChunkMesh(world: World, chunk: Chunk) {
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    for (let y = 0; y < CHUNK_H; y++) {
        for (let z = 0; z < CHUNK_D; z++) {
            for (let x = 0; x < CHUNK_W; x++) {
                if (chunk.getVoxel(x, y, z) == 0) continue;
                if (!hasVoxel(world, chunk, x, y + 1, z)) {
                    const startI = vertices.length / 3;
                    vertices.push(x + 0.5, y + 0.5, z + 0.5); // 0
                    vertices.push(x + 0.5, y + 0.5, z - 0.5); // 1
                    vertices.push(x - 0.5, y + 0.5, z + 0.5); // 2

                    vertices.push(x - 0.5, y + 0.5, z - 0.5); // 3
                    indices.push(startI);
                    indices.push(startI + 1);
                    indices.push(startI + 2);
                    indices.push(startI + 1);
                    indices.push(startI + 3);
                    indices.push(startI + 2);
                    normals.push(0, 1, 0);
                    normals.push(0, 1, 0);
                    normals.push(0, 1, 0);
                    normals.push(0, 1, 0);
                }

                if (!hasVoxel(world, chunk, x, y - 1, z)) {
                    const startI = vertices.length / 3;
                    vertices.push(x - 0.5, y - 0.5, z + 0.5); // 0
                    vertices.push(x + 0.5, y - 0.5, z - 0.5); // 1
                    vertices.push(x + 0.5, y - 0.5, z + 0.5); // 2
                    vertices.push(x - 0.5, y - 0.5, z - 0.5); // 3
                    indices.push(startI);
                    indices.push(startI + 1);
                    indices.push(startI + 2);
                    indices.push(startI);
                    indices.push(startI + 3);
                    indices.push(startI + 1);
                    normals.push(0, -1, 0);
                    normals.push(0, -1, 0);
                    normals.push(0, -1, 0);
                    normals.push(0, -1, 0);
                }

                if (!hasVoxel(world, chunk, x - 1, y, z)) {
                    const startI = vertices.length / 3;
                    vertices.push(x - 0.5, y + 0.5, z + 0.5); // 0
                    vertices.push(x - 0.5, y + 0.5, z - 0.5); // 1
                    vertices.push(x - 0.5, y - 0.5, z + 0.5); // 2
                    vertices.push(x - 0.5, y - 0.5, z - 0.5); // 3
                    indices.push(startI);
                    indices.push(startI + 1);
                    indices.push(startI + 2);
                    indices.push(startI + 1);
                    indices.push(startI + 3);
                    indices.push(startI + 2);
                    normals.push(-1, 0, 0);
                    normals.push(-1, 0, 0);
                    normals.push(-1, 0, 0);
                    normals.push(-1, 0, 0);
                }

                if (!hasVoxel(world, chunk, x + 1, y, z)) {
                    const startI = vertices.length / 3;
                    vertices.push(x + 0.5, y - 0.5, z + 0.5); // 0
                    vertices.push(x + 0.5, y + 0.5, z - 0.5); // 1
                    vertices.push(x + 0.5, y + 0.5, z + 0.5); // 2
                    vertices.push(x + 0.5, y - 0.5, z - 0.5); // 3
                    indices.push(startI);
                    indices.push(startI + 1);
                    indices.push(startI + 2);
                    indices.push(startI);
                    indices.push(startI + 3);
                    indices.push(startI + 1);
                    normals.push(1, 0, 0);
                    normals.push(1, 0, 0);
                    normals.push(1, 0, 0);
                    normals.push(1, 0, 0);
                }

                if (!hasVoxel(world, chunk, x, y, z - 1)) {
                    const startI = vertices.length / 3;
                    vertices.push(x + 0.5, y + 0.5, z - 0.5);
                    vertices.push(x + 0.5, y - 0.5, z - 0.5);
                    vertices.push(x - 0.5, y + 0.5, z - 0.5);
                    vertices.push(x - 0.5, y - 0.5, z - 0.5);
                    indices.push(startI);
                    indices.push(startI + 1);
                    indices.push(startI + 2);
                    indices.push(startI + 1);
                    indices.push(startI + 3);
                    indices.push(startI + 2);
                    normals.push(0, 0, -1);
                    normals.push(0, 0, -1);
                    normals.push(0, 0, -1);
                    normals.push(0, 0, -1);
                }

                if (!hasVoxel(world, chunk, x, y, z + 1)) {
                    const startI = vertices.length / 3;
                    vertices.push(x - 0.5, y + 0.5, z + 0.5);
                    vertices.push(x + 0.5, y - 0.5, z + 0.5);
                    vertices.push(x + 0.5, y + 0.5, z + 0.5);
                    vertices.push(x - 0.5, y - 0.5, z + 0.5);
                    indices.push(startI);
                    indices.push(startI + 1);
                    indices.push(startI + 2);
                    indices.push(startI);
                    indices.push(startI + 3);
                    indices.push(startI + 1);
                    normals.push(0, 0, 1);
                    normals.push(0, 0, 1);
                    normals.push(0, 0, 1);
                    normals.push(0, 0, 1);
                }
            }
        }
    }

    return { vertices: vertices, normals: normals, indices: indices };
}

export function createMesh(world: World) {
    const meshes: { vertices: number[], normals: number[], indices: number[], chunk: Chunk }[] = [];
    world.chunks.forEach(chunk => {
        meshes.push({...generateChunkMesh(world, chunk), chunk });
    });
    return meshes;
}