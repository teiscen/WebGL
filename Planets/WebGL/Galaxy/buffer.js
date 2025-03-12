import { createVao as BUFFER_createVAO } from "../_Tools/buffer.js"



class Buffer {

    static createVao(gl, data){
        const vaoHelper = (gl, vBuffer, iBuffer, tBuffer) => {
            const vao = gl.createVertexArray();
            gl.bindVertexArray(vao);
    
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4*7, 0);   // Posn (loc=0)
            gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 4*7, 4*3); // Color(loc=1)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        
            gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
            gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 4*8, 0);   // Radius (Scale)
            gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 4*8, 4*1); // Posn
            gl.vertexAttribPointer(4, 4, gl.FLOAT, false, 4*8, 4*4); // Color()
            
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
            gl.enableVertexAttribArray(2);
            gl.enableVertexAttribArray(3);
            gl.enableVertexAttribArray(4);
        
            // How much each instance advances the transform buffers
            // each transform buffer is unique so they each advance once
            gl.vertexAttribDivisor(2, 1);
            gl.vertexAttribDivisor(3, 1);
            gl.vertexAttribDivisor(4, 1);
        
            gl.bindVertexArray(null);
            return vao;
        }

        return BUFFER_createVAO(gl, data, vaoHelper);
    }

}

export { Buffer }