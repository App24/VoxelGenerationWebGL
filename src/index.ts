export let gl: WebGL2RenderingContext;

(() => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl = canvas.getContext("webgl2");

    document.body.appendChild(canvas);
})();