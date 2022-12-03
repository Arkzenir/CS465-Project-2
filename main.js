let canvas;
let rect;
let gl;

const MAX_CYLINDER_COUNT = 120;
const VERTICES_PER_CYLINDER = 240;
const maxNumVertices = MAX_CYLINDER_COUNT * VERTICES_PER_CYLINDER;
let numOfVertices = 0;

let cIndex = 0;
let in1, in2, in3, in4 = vec2(0, 0);

const indicatorColor = vec4(1.0,0.65,0.0,1); //bright orange
let modelViewMatrix, projectionMatrix;
let vBuffer;
let cBuffer;
let program;
let selector;

let idRGBAConvert;
let pixel;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    selector = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    let modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-2, 2, -2, 2, -2, 2);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    //Initialize the frame buffer manager
    idRGBAConvert = new ColorToID;
    pixel = new Uint8Array(4);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    console.log(canvas);

    rect = canvas.getBoundingClientRect();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(modelViewMatrix) );
    gl.drawArrays( gl.TRIANGLES, 0, numOfVertices );
    requestAnimFrame(render);
}