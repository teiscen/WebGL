import { Buffer } from "./Buffers/buffers.js";
import { shaderProgram } from "./Shaders/shaderCode.js";
import { bindUniform } from "./Uniform/uniforms.js";
import {MazeGeneratorFactory} from "../Logic/MazeGenerator.js"

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
