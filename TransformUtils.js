
function generateCylinder(cr = 0.15, cyheight = 1, ratio = 1) {
    const cylinderAngle = Math.PI / 180 * 18; // 18 degrees, 90/5
    const baseVerticeNum = 21;
    // cr = cylinder radius

    let points = [];

    const vertices = [
        vec4(0, 0, 0, 1.0), // center

        vec4(-1 * cr, 0, 0, 1.0), // left
        vec4(-1 * cr * Math.cos(cylinderAngle), 0, (Math.sin(cylinderAngle) * cr), 1.0),
        vec4(-1 * cr * Math.cos(cylinderAngle * 2), 0, (Math.sin(cylinderAngle * 2) * cr), 1.0),
        vec4(-1 * cr * Math.cos(cylinderAngle * 3), 0, (Math.sin(cylinderAngle * 3) * cr), 1.0),
        vec4(-1 * cr * Math.cos(cylinderAngle * 4) * cr, 0, (Math.sin(cylinderAngle * 4) * cr), 1.0),

        vec4(0, 0, cr, 1.0), // bottom
        vec4((Math.sin(cylinderAngle) * cr), 0, (Math.cos(cylinderAngle) * cr), 1.0),
        vec4((Math.sin(cylinderAngle * 2) * cr), 0, (Math.cos(cylinderAngle * 2) * cr), 1.0),
        vec4((Math.sin(cylinderAngle * 3) * cr), 0, (Math.cos(cylinderAngle * 3) * cr), 1.0),
        vec4((Math.sin(cylinderAngle * 4) * cr), 0, (Math.cos(cylinderAngle * 4) * cr), 1.0),

        vec4(cr, 0, 0, 1.0), // right
        vec4((Math.cos(cylinderAngle) * cr), 0, 0 - (Math.sin(cylinderAngle) * cr), 1.0),
        vec4((Math.cos(cylinderAngle * 2) * cr), 0, 0 - (Math.sin(cylinderAngle * 2) * cr), 1.0),
        vec4((Math.cos(cylinderAngle * 3) * cr), 0, 0 - (Math.sin(cylinderAngle * 3) * cr), 1.0),
        vec4((Math.cos(cylinderAngle * 4) * cr), 0, 0 - (Math.sin(cylinderAngle * 4) * cr), 1.0),

        vec4(0, 0, -1 * cr, 1.0), // top
        vec4(0 - (Math.sin(cylinderAngle) * cr), 0, -1 * (Math.cos(cylinderAngle) * cr), 1.0),
        vec4(0 - (Math.sin(cylinderAngle * 2) * cr), 0, -1 * (Math.cos(cylinderAngle * 2) * cr), 1.0),
        vec4(0 - (Math.sin(cylinderAngle * 3) * cr), 0, -1 * (Math.cos(cylinderAngle * 3) * cr), 1.0),
        vec4(0 - (Math.sin(cylinderAngle * 4) * cr), 0, -1 * (Math.cos(cylinderAngle * 4) * cr), 1.0),

        vec4(0, cyheight, 0, 1.0), // center of TOP cylinder

        vec4(-1 * cr * ratio, cyheight, 0, 1.0), // left
        vec4((-1 * (Math.cos(cylinderAngle) * cr)) * ratio, cyheight, (Math.sin(cylinderAngle) * cr), 1.0),
        vec4((-1 * (Math.cos(cylinderAngle * 2) * cr)) * ratio, cyheight, (Math.sin(cylinderAngle * 2) * cr), 1.0),
        vec4((-1 * (Math.cos(cylinderAngle * 3) * cr)) * ratio, cyheight, (Math.sin(cylinderAngle * 3) * cr), 1.0),
        vec4((-1 * (Math.cos(cylinderAngle * 4) * cr)) * ratio, cyheight, (Math.sin(cylinderAngle * 4) * cr), 1.0),

        vec4(0, cyheight, cr, 1.0), // bottom
        vec4((Math.sin(cylinderAngle) * cr) * ratio, cyheight, (Math.cos(cylinderAngle) * cr), 1.0),
        vec4((Math.sin(cylinderAngle * 2) * cr) * ratio, cyheight, (Math.cos(cylinderAngle * 2) * cr), 1.0),
        vec4((Math.sin(cylinderAngle * 3) * cr) * ratio, cyheight, (Math.cos(cylinderAngle * 3) * cr), 1.0),
        vec4((Math.sin(cylinderAngle * 4) * cr) * ratio, cyheight, (Math.cos(cylinderAngle * 4) * cr), 1.0),

        vec4(cr * ratio, cyheight, 0, 1.0), // right
        vec4((Math.cos(cylinderAngle) * cr) * ratio, cyheight, 0 - (Math.sin(cylinderAngle) * cr), 1.0),
        vec4((Math.cos(cylinderAngle * 2) * cr) * ratio, cyheight, 0 - (Math.sin(cylinderAngle * 2) * cr), 1.0),
        vec4((Math.cos(cylinderAngle * 3) * cr) * ratio, cyheight, 0 - (Math.sin(cylinderAngle * 3) * cr), 1.0),
        vec4((Math.cos(cylinderAngle * 4) * cr) * ratio, cyheight, 0 - (Math.sin(cylinderAngle * 4) * cr), 1.0),

        vec4(0, cyheight, -1 * cr, 1.0), // top
        vec4(0 - (Math.sin(cylinderAngle) * cr) * ratio, cyheight, -1 * (Math.cos(cylinderAngle) * cr), 1.0),
        vec4(0 - (Math.sin(cylinderAngle * 2) * cr) * ratio, cyheight, -1 * (Math.cos(cylinderAngle * 2) * cr), 1.0),
        vec4(0 - (Math.sin(cylinderAngle * 3) * cr) * ratio, cyheight, -1 * (Math.cos(cylinderAngle * 3) * cr), 1.0),
        vec4(0 - (Math.sin(cylinderAngle * 4) * cr) * ratio, cyheight, -1 * (Math.cos(cylinderAngle * 4) * cr), 1.0)
    ];

    for ( let i = 1; i < baseVerticeNum-1; i++ ){ // baseVerticeNum=21, loop until 20 exclusive
        points.push(vertices[0]);
        points.push(vertices[i]);
        points.push(vertices[i+1]);
    }   // 19 * 3
    points.push(vertices[0]);
    points.push(vertices[baseVerticeNum-1]);
    points.push(vertices[1]);   // 20 * 3 = 60 vertices

    for ( let i = baseVerticeNum+1; i < baseVerticeNum*2 -1; i++ ){ // baseVerticeNum=21, loop until 41 exclusive
        points.push(vertices[baseVerticeNum]);
        points.push(vertices[i]);
        points.push(vertices[i+1]);
    }

    points.push(vertices[baseVerticeNum]);
    points.push(vertices[baseVerticeNum*2 -1]);
    points.push(vertices[baseVerticeNum+1]);    // 120 vertices

    for ( let i = 1; i < baseVerticeNum; i++){
        if ( i === baseVerticeNum-1 ) {
            points.push(vertices[i]);
            points.push(vertices[i + baseVerticeNum]);
            points.push(vertices[baseVerticeNum + 1]);
            points.push(vertices[i]);
            points.push(vertices[1]);
            points.push(vertices[ baseVerticeNum + 1]);
        }
        else {
            points.push(vertices[i]);
            points.push(vertices[i + baseVerticeNum]);
            points.push(vertices[i + baseVerticeNum + 1]);
            points.push(vertices[i]);
            points.push(vertices[i + 1]);
            points.push(vertices[i + baseVerticeNum + 1]);

        }
    }

    return points;
}

function cylinderTransformMatrix(xScale = 1, yScale, zRot, yRot, yShift) {
    let sMat = scale([xScale, yScale, xScale]);

    let rotateZ = rotate(zRot, [0,0,1]);
    let rotateY = rotate(yRot, [0,1,0]);
    let rMat = mult(rotateZ, rotateY);
    let tMat = translate(0, yShift, 0);

    let returnMatrix = mat4();

    returnMatrix = mult(returnMatrix,sMat);
    returnMatrix = mult(returnMatrix,tMat);
    returnMatrix = mult(returnMatrix,rotateZ);
    returnMatrix = mult(returnMatrix,rotateY);


    return returnMatrix;
}

function returnRandom(start, end, float = true) {
    if(float) return (start + Math.random() * (end - start));
    return Math.floor((start + Math.random() * (end - start)));
}

function matMultVec(matr, vect){
    let m = vec4();
    for (let i = 0; i < 4; i++){
        m[i] = 0;
        for (let j = 0; j < 4; j++)
            m[i] += matr[i][j] * vect[j];
    }
    return m;
}