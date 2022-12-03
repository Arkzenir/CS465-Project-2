class TreeNode {
    id = 0;
    localTransform = mat4();
    children = [];
    drawn = false;
    parent = null;
}
treeAsArray = [4,3,3,2]; // 1 trunk, 4 branches that have 3 branches that have 3 branches that have 2 branches
function constructTree(arrayIn)
{
    let root = new TreeNode();
    let nodeList = [root];
    let index = 1;

    let randomisedCount;
    let randAmnt;
    let tempList;

    for (let i = 0; i < arrayIn.length; i++) {
        randAmnt = 0
        if (arrayIn[i] > 2) randAmnt = 2
        else randAmnt = 1;

        randomisedCount = arrayIn[i] + ((Math.floor((Math.random() * 3)) - 1) * randAmt);
        for (let j = 0; j < arrayIn[i]; j++) {
            for (const n of nodeList) {
                const t = new TreeNode();
                t.id = index;
                //randomise localTransform here

                if (i !== 0) t.parent = n;

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
    return root;
}

function traverseTree(root){
    if (root == null){
        return;
    }
    nodeMatrices = [];
    nodeMatrices.push(root.localTransform);
    finalMatrices = [];
    finalMatrices.push(root.localTransform);
    for (let i = 0; i < node.children.length; i++){
        traverseHelper(node.children[i], nodeMatrices, finalMatrices);
    }
    return finalMatrices;
}

function traverseHelper(node, nodeMatrices, finalMatrices){
    nodeMatrices.push(node.localTransform);
    if ( node.children.length == 0){        // base case
        for ( let i = 1; i < nodeMatrices.length; i++){
            nodeMatrices[i] = mult(nodeMatrices[i-1], nodeMatrices[i]);
        }
        finalMatrices.push(nodeMatrices[nodeMatrices.length - 1]);
    }
    else {
        for (let i = 0; i < node.children.length; i++){
            traverseHelper(node.children[i], nodeMatrices);
        }
    }
}