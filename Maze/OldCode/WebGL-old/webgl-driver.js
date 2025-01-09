import { mazeShaderProgram } from "./shader.js";
import { initMazeBuffer } from "./buffers.js";
import { drawScene2D } from "./drawScene.js"
import { MazeGeneratorFactory } from "../../Maze/Logic/MazeGenerator.js";


main();

function main(){

    const canvas = document.getElementById("canvas-gl");
    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        alert("Unable to initialize WebGL.");
        return;
    }

    const mazeGen = new MazeGeneratorFactory();
    const maze = mazeGen.dfsFactory(5, 6);
    // console.log("Maze1: row:5, col:6");
    // console.log(maze.cellArray.length);
    // console.log(maze.cellArray[0].length);
    // maze.print();

    // Swap this line out for different types of programs
    const programInfo = mazeShaderProgram(gl);
    const buffers = initMazeBuffer(gl, maze);

    drawScene2D(gl, programInfo, buffers, getCellSize(canvas, maze));
}

function getCellSize(canvas, maze){
    let xMax = maze.cellArray[0].length / canvas.width;
    let yMax = maze.length / canvas.height;

    return Math.max(xMax, yMax);
}
