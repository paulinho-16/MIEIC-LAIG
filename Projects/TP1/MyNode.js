/**
 * MyNode class, saving the node information of scenegraph
 * @constructor
 * @param root - Reference to root node
 */
class MyNode {
	constructor(root) {
        // Origin Node
        this.rootID = root;

        // Transformation
        this.transformation = mat4.create();
        mat4.identity(this.transformation);

        // Texture
        this.texture = null;

        // Material
        this.material = null;

        // Amplification
        this.afs = 1.0;
        this.aft = 1.0;

        // All descendants nodes and leaves
        this.descendants = [];
        this.leaves = [];
    }

    /**
     * Add descendants nodes
     * @param node Descendant node
     */
    addDescendants(node) {
        this.descendants.push(node);
    }

     /**
     * Add leaf nodes
     * @param leaf Leaf node
     */
    addLeaf(leaf) {
        this.leaves.push(leaf);
    }
}