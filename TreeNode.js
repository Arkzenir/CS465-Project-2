class TreeNode {
    id = 0;
    localTransform = mat4();
    children = [];
    parentYScale = 1;
    parentYRot = 180;
    parentYShift = 0;
    ownYScale = 1;
    ownYRot = 180;
    ownYShift = 0;
    parent = null;
}
//treeAsArray = [4,3,3,2]; // 1 trunk, 4 branches that have 3 branches that have 3 branches that have 2 branches
function constructTree(arrayIn)
{
    let root = new TreeNode();
    let nodeList = [root];
    let index = 1;

    let maxLength = 4.0;

    let xScale;
    let yScale;
    let zRot;
    let yRot;
    let yShift;

    //let randomisedCount;
    let randAmnt;
    let tempList;

    for (let i = 0; i < arrayIn.length; i++) {
        randAmnt = 0
        if (arrayIn[i] > 2) randAmnt = 2
        else randAmnt = 1;

        //randomisedCount = arrayIn[i] + ((Math.floor((Math.random() * 3)) - 1) * randAmt);
        for (let j = 0; j < arrayIn[i]; j++) {
            for (const n of nodeList) {
                const t = new TreeNode();
                t.id = index;
                if (i !== 0){
                    t.parent = n;
                    t.parentYScale = t.parent.ownYScale;
                    t.parentYRot = t.parent.ownYRot;
                    t.parentYShift = t.parent.ownYShift;

                }

                //randomise localTransform here
                yScale = returnRandom(0.5,1);
                //yScale = 0.5;

                zRot = returnRandom(10,65);
                yRot = returnRandom(10,350);
                yShift = returnRandom(0.2,0.75);

                //console.log(yRot);

                t.ownYScale = yScale;
                t.ownYRot = yRot;
                t.ownYShift = yShift;

                //t.localTransform = cylinderTransformMatrix((currLength/maxLength) / 1.5, 1,zRot,yRot,yShift);
                t.localTransform = cylinderTransformMatrix(0.5, yScale ,zRot,yRot ,yShift);
                n.children.push(t);
                index++;
            }
        }
        tempList = [];
        for (const node of nodeList) {
            tempList.push(...node.children);
        }
        nodeList = tempList;
    }
    xScale = 0.85;
    yScale = maxLength;
    root.localTransform = cylinderTransformMatrix(xScale, yScale,0,0,-0.5)
    root.ownYScale = yScale;

    return root;
}

function traverseTree(root){
    if (root == null){
        return;
    }
    let nodeMatrices = [];
    nodeMatrices.push(root.localTransform);

    let finalMatrices = [];
    finalMatrices.push(root.localTransform);
    for (let i = 0; i < root.children.length; i++){
        traverseHelper(root.children[i], structuredClone(nodeMatrices), finalMatrices);
    }
    return finalMatrices;
}

function traverseHelper(node, nodeMatrices, finalMatrices){
    nodeMatrices.push(node.localTransform);
    const cur = nodeMatrices.length - 1;
    nodeMatrices[cur] = mult(nodeMatrices[cur -1], nodeMatrices[cur]);
    finalMatrices.push(nodeMatrices[nodeMatrices.length - 1]);
    if ( node.children.length !== 0){
        for (let i = 0; i < node.children.length; i++){
            traverseHelper(node.children[i], structuredClone(nodeMatrices), finalMatrices);
        }
    }
}