class TreeNode {
    id = 0;
    localTransform = mat4();
    children = [];
    drawn = false;
    parentYScale = -1;
    ownYScale = 1;
    parent = null;
}
//treeAsArray = [4,3,3,2]; // 1 trunk, 4 branches that have 3 branches that have 3 branches that have 2 branches
function constructTree(arrayIn)
{
    let root = new TreeNode();
    let nodeList = [root];
    let index = 1;

    let maxLength = 5;

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
            for (let k = 0; k < nodeList.length; k++) {
                const t = new TreeNode();
                t.id = index;
                if (i !== 0){
                    t.parent = nodeList[k];
                    t.parentYScale = nodeList[k].ownYScale;
                }

                //randomise localTransform here
                yScale = returnRandom(1,maxLength);
                t.ownYScale = yScale;
                zRot = returnRandom(10,160);
                yRot = returnRandom(0,359);
                yShift = returnRandom(0,t.parentYScale);

                console.log(yScale);
                console.log(zRot);
                console.log(yRot);
                console.log(yShift);
                t.localTransform = cylinderTransformMatrix(yScale,zRot,yRot,yShift);

                nodeList[k].children.push(t);
                index++;
            }
        }
        tempList = [];
        for (const node of nodeList) {
            tempList.push(...node.children);
        }
        nodeList = tempList;
    }

    root.localTransform = cylinderTransformMatrix(10,0,0,0)

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