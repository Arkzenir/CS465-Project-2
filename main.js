let canvas;
let rect;
let gl;

const MAX_CYLINDER_COUNT = 300;
const VERTICES_PER_CYLINDER = 240;
const maxNumVertices = MAX_CYLINDER_COUNT * VERTICES_PER_CYLINDER;
let numOfVertices = 0;

let unitCylinder;
//Tree variables
let minLevels = 2;
let maxLevels = 5;
let minBranchCount = 2;
let maxBranchCount = 4;

let treeArray = [];

let cIndex = 0;
let in1, in2, in3, in4 = vec2(0, 0);

const indicatorColor = vec4(1.0,0.65,0.0,1); //bright orange
let modelViewMatrix, projectionMatrix;
let vBuffer;
let cBuffer;
let nBuffer;
let program;
let selector;
let shading;

let isShading = false;

let modelViewMatrixLoc;

let mainVertexList = [];
let normalsList = [];
let colorsList = [];

const colors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 1.0, 1.0)   // white
];

const lightPosition = vec4(5.0, 5.0, 5.0, 0.0);
const lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
const lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
const lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

const materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
const materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
const materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
const materialShininess = 100.0;

let ctm;
let ambientColor, diffuseColor, specularColor;
let viewerPos;

//Frame buffer implementation of polygon index - RGBA transformations
class ColorToID{
    redBits = gl.getParameter(gl.RED_BITS);
    greenBits = gl.getParameter(gl.GREEN_BITS);
    blueBits = gl.getParameter(gl.BLUE_BITS);
    alphaBits = gl.getParameter(gl.ALPHA_BITS);

    redShift = Math.pow(2, this.greenBits + this.blueBits + this.alphaBits);
    greenShift = Math.pow(2, this.blueBits + this.alphaBits);
    blueShift = Math.pow(2, this.alphaBits);

    color = new Float32Array(4);

    //Get integer ID for a given RGBA value
    getID(r, g, b, a) {
        // Shift each component to its bit position in the integer
        return (r * this.redShift + g * this.greenShift + b * this.blueShift + a);
    }

    //Get RGBA value from given id
    createColor(id) {
        let r, g, b, a;

        r = Math.floor(id / this.redShift);
        id = id - (r * this.redShift);

        g = Math.floor(id / this.greenShift);
        id = id - (g * this.greenShift);

        b = Math.floor(id / this.blueShift);
        id = id - (b * this.blueShift);

        a = id;

        this.color[0] = r / (Math.pow(2, this.redBits) - 1);
        this.color[1] = g / (Math.pow(2, this.greenBits) - 1);
        this.color[2] = b / (Math.pow(2, this.blueBits) - 1);
        this.color[3] = a / (Math.pow(2, this.alphaBits) - 1);

        return this.color;
    }
}

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

    unitCylinder = generateCylinder();

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    shading = initShaders(gl, "shading-shader", "fragment-shader");
    selector = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    modelViewMatrix = mat4();
    projectionMatrix = ortho(-4, 4, -4, 4, -4, 4);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );
    gl.useProgram(shading);
    gl.uniformMatrix4fv( gl.getUniformLocation(shading, "projectionMatrix"),  false, flatten(projectionMatrix) );
    gl.useProgram(program);

    //Initialize the frame buffer manager
    idRGBAConvert = new ColorToID;
    pixel = new Uint8Array(4);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    const vPositionShading = gl.getAttribLocation(shading, "vPosition");
    gl.vertexAttribPointer(vPositionShading, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPositionShading);

    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW );

    const vNormal = gl.getAttribLocation(shading, "vNormal");
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    rect = canvas.getBoundingClientRect();

    //modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");



    let ambientProduct = mult(lightAmbient, materialAmbient);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
        flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
        flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
        flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
        "shininess"),materialShininess);

    document.getElementById("flat").addEventListener("click", function(event) {
        buildTree(randomTreeStructure());
        addColor();
        isShading = false;
        console.log(colorsList);
        gl.useProgram(program);
        render();
    });

    document.getElementById("shading").addEventListener("click", function(event) {
        buildTree(randomTreeStructure());
        computeNormals();
        console.log(normalsList);
        isShading = true;
        gl.useProgram(shading);
        render();
    });

    document.getElementById("slide-base").addEventListener("change", function () {
       modelViewMatrix = mult(modelViewMatrix,rotate(event.srcElement.value, [0,1,0]));
        render();
    });
    document.getElementById("apply-translate").addEventListener("click", function (){
        let y = parseInt(document.getElementById("y-translate").value);
        modelViewMatrix = mult(modelViewMatrix,translate(0,y,0));
        render();
    });



    render();
}

function randomTreeStructure()
{
    let size = returnRandom(minLevels,maxLevels,false);
    for (let i = 0; i < size; i++) {
        treeArray[i] = returnRandom(minBranchCount,maxBranchCount, false);
    }

    treeArray = [1];

    let result = constructTree(treeArray);
    console.log(result);
    return result
}

function buildTree(root)
{
    mainVertexList = [];
    let finalTransformsList = traverseTree(root);
    console.log(finalTransformsList);
    console.log(unitCylinder);

    //let m = finalTransformsList[2];
    //let v = unitCylinder[11];

    //console.log(matMultVec(m,v));

    for (const e of finalTransformsList) {
        for (const vertex of unitCylinder) {
            mainVertexList.push(matMultVec(e,vertex));
        }
    }

    //mainVertexList = [[0,0,0,1],[1,0,0,1], [0,1,0,1]];
    console.log(mainVertexList);

    numOfVertices = mainVertexList.length;

}

function computeNormals()
{
    normalsList = [];
    let t1;
    let t2;
    let normal_temp;
    let normal;
    for (let i = 0; i < mainVertexList.length; i += 3) {
        t1 = subtract(mainVertexList[i+1], mainVertexList[i]);
        t2 = subtract(mainVertexList[i+2], mainVertexList[i+1]);
        normal_temp = cross(t1, t2);
        normal = vec3(normal_temp);

        normalsList.push(normal);
        normalsList.push(normal);
        normalsList.push(normal);
    }
}

function addColor(cIndex)
{
    colorsList = [];
    for (const v of mainVertexList) {
        colorsList.push(colors[returnRandom(0,7, false)]);
    }
}

const render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (isShading)
    {
        gl.uniformMatrix4fv( gl.getUniformLocation(shading, "modelViewMatrix"),  false, flatten(modelViewMatrix) );
        for (let i = 0; i < numOfVertices; i++) {
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            gl.bufferSubData( gl.ARRAY_BUFFER, 8 * i, flatten(mainVertexList[i]) );

            gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
            gl.bufferSubData( gl.ARRAY_BUFFER, 8 * i, flatten(normalsList[i]));
        }

    }else {
        gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"),  false, flatten(modelViewMatrix) );
        for (let i = 0; i < numOfVertices; i++) {
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            gl.bufferSubData( gl.ARRAY_BUFFER, 8 * i, flatten(mainVertexList[i]) );

            gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
            gl.bufferSubData( gl.ARRAY_BUFFER, 16 * i, flatten(colorsList[i]));
        }
    }

    for (let i = 0; i < numOfVertices; i += 1) {
        gl.drawArrays(gl.TRIANGLES, i * 3, 3);
    }

};