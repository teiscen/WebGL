import { Buffer } from "./Buffers/buffers.js";
import { shaderProgram } from "./Shaders/shaderCode.js";
import { bindUniform } from "./Uniform/uniforms.js";
import {MazeGeneratorFactory} from "../Logic/MazeGenerator.js"

// Mock maze
const maze1 = {cellArray : [
    [
        { walls: 0b1000, coordinate: { row: 0, col: 0 } },
        { walls: 0b0100, coordinate: { row: 0, col: 1 } },
        { walls: 0b0010, coordinate: { row: 0, col: 2 } },
        { walls: 0b0001, coordinate: { row: 0, col: 3 } }
    ],
    [
        { walls: 0b1100, coordinate: { row: 1, col: 0 } },
        { walls: 0b0110, coordinate: { row: 1, col: 1 } },
        { walls: 0b0011, coordinate: { row: 1, col: 2 } },
        { walls: 0b1001, coordinate: { row: 1, col: 3 } }
    ],
    [
        { walls: 0b1110, coordinate: { row: 2, col: 0 } },
        { walls: 0b0111, coordinate: { row: 2, col: 1 } },
        { walls: 0b1011, coordinate: { row: 2, col: 2 } },
        { walls: 0b1101, coordinate: { row: 2, col: 3 } }
    ],
    [
        { walls: 0b0000, coordinate: { row: 3, col: 0 } },
        { walls: 0b1111, coordinate: { row: 3, col: 1 } },
        { walls: 0b1010, coordinate: { row: 3, col: 2 } },
        { walls: 0b0101, coordinate: { row: 3, col: 3 } }
    ]
]};



main();

function main(){
    const canvas = document.getElementById("canvas-gl");
    const gl = canvas.getContext("webgl2");
    
    if (gl === null) {
        alert("Unable to initialize WebGL.");
        return;
    }
    
    // Default
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);


    const mazeGen = new MazeGeneratorFactory;
    const maze = mazeGen.dfsFactory(120, 160);
    
    // Set up Uniforms
    // Enabled the 2 matrices later 
    const shader = shaderProgram(gl);
    gl.useProgram(shader.program);    

    // Currently a mess need to fix up
    bindUniform(gl, shader, {
        rows: maze?.cellArray?.length || 0,
        cols: maze?.cellArray?.[0]?.length || 0,
    });
    
    // Set transforms
    // get draw details
    const buffer = new Buffer;
    buffer.setTransformData(maze);
    
    const drawInfo = buffer.getDrawInfo(gl);
    drawInfo.forEach((value) => {
        gl.bindVertexArray(value.vao);
        gl.drawElementsInstanced(gl.TRIANGLES, value.idxCount, gl.UNSIGNED_INT, 0, value.insCount);
        gl.bindVertexArray(null);
    });
}
