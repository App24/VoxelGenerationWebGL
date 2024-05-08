export function isPowerOf2(value:number) {
    return (value & (value - 1)) == 0;
}

export function toRadians(degrees:number){
    return degrees * (Math.PI / 180.0);
}