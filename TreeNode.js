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
