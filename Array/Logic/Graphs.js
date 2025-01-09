/*
WebGL:
Nodes are placed on the edge of a circle
if there are edges a line is drawn connecting them

Logic:
    if a path is added then we need to replace the previous with the current

    Graph -> nodeArray -> Node -> (nodeID and paths -> (nodeId and weight))
*/

class Graph{
    constructor(){
        this.nodes = [];
    }

    addNode(node){
        this.nodes.push(node);
    }

    getNode(nodeID){
        return this.nodes.find(node => node.nodeID === nodeID) || false;
    }
}

class Node{
    constructor(nodeID, path){
        this.nodeID = nodeID;
        this.paths = new Map;
    }

    // Paths is a container with nodeId and weight
    addPathArray(paths){
        paths.array.forEach((path) => {
            this.paths.set(path.nodeID, path.weight);
        });
    }

    addPath(nodeId, weight){
        this.paths.set(nodeId, weight);
    }

    getPath(){
        return this.paths;
    }
}

const graphExample = new Graph;
{
    const nodeA = new Node("A");
    const nodeB = new Node("B");
    const nodeC = new Node("C");

    // Add nodes to graph
    graphExample.addNode(nodeA);
    graphExample.addNode(nodeB);
    graphExample.addNode(nodeC);

    // Add paths to nodes
    nodeA.addPath("B", 5);
    nodeA.addPath("C", 10);

    nodeB.addPath("A", 5);
    nodeB.addPath("C", 2);

    nodeC.addPath("A", 10);
    nodeC.addPath("B", 2);
}

export { graphExample }