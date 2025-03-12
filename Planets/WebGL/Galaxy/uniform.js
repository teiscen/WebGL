import { OrthoFactory } from "../_Tools/uniform.js";
import { mat4 } from "../../../node_modules/gl-matrix/esm/index.js"


class Uniform{
    // This is going to be for galaxy in the future
    /**
     * Binds the shader and uniforms to the glContext
     * @param {glContext} gl 
     * @param {shaderProgram} shader 
     */
    static bindUniform(gl, shader){
        const zoomFactor = 3.0;
        // const zoomFactor = 1.0;
        const projectionMatrix = OrthoFactory.orthoCentered(gl, zoomFactor);

        gl.uniformMatrix4fv(
            shader.uniformLocations.uProjectionMatrix,
            false,
            projectionMatrix,
        );

        // Determines shows on the canvas
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,    // Matrix Destination
            modelViewMatrix,    // Matrix to Modify
            [0.0, 0.0, -0.1]    // Brought up 
        );
        
        gl.uniformMatrix4fv(
            shader.uniformLocations.uModelViewMatrix,
            false,
            modelViewMatrix,
        );

        // Other uniforms go here
        // const cellSize = Math.min(cellWidth, cellHeight);
        // gl.uniform1f(shader.uniformLocations.uScale, cellSize);
    }

}

export { Uniform }