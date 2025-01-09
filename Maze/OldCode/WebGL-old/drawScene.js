import { getDrawDetails, vertexData } from "./buffers.js";



function drawScene2D(gl, programInfo, buffers, cellSize){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);


    const left = 0;
    const right = gl.canvas.clientWidth;
    const top = 0;
    const bottom = gl.canvas.clientHeight;
    const zFar = 100.0;
    const zNear = 0.1;
    const projectionMatrix = mat4.create();
    mat4.ortho(
        projectionMatrix, 
        left,
        right, 
        bottom,
        top,
        zNear, 
        zFar,
    );

    const modelViewMatrix = mat4.create();
    mat4.translate(
        modelViewMatrix,    // Matrix Destination
        modelViewMatrix,    // Matrix to Modify
        [-0.0, 0.0, -3.0],  // Modifications
    );

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );
    gl.uniform1f(
        programInfo.uniformLocations.scale,
        false,
        cellSize
    );

    draw(gl, buffers);
}


// Currently scuffed, need to reorganize
function draw(gl, buffers){
    const deets = getDrawDetails(gl, maze);
    deets.forEach((value) => {
        // gl.bindVertexArray(value.vao);
        // console.log(value);
        // checkGLError(gl);

        const arrayBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuff);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4*7, 0); // Posn (loc=0)
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 4*7, 4*3); // Color(loc=1)

        const transBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, transBuff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value.tran), gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4*7, 0); // Vec2 Posn
        gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 4*7, 4*2); // Rotation Angle
        gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 4*7, 4*3); // Color(to mult)
    
        const indexBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, value.ind, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);
        gl.enableVertexAttribArray(3);
        gl.enableVertexAttribArray(4);
    
        gl.vertexAttribDivisor(2, 1);
        gl.vertexAttribDivisor(3, 1);
        gl.vertexAttribDivisor(4, 1);

        console.log(`${value.ind.length} ${value.tran.length/7} `);
        //gl.drawElementsInstanced(gl.TRIANGLES, value.ind.length, gl.UNSIGNED_INT, 0, value.tran.length/7);
        gl.drawElements(gl.TRIANGLES, value.ind.length, gl.UNSIGNED_INT, 0);
    });
}


function checkGLError(gl) {
    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
      console.error("OpenGL error:", error);
      return false;
    }
    return true;
  }



// set any attributes

export { drawScene2D }