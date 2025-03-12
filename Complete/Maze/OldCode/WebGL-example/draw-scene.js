



function drawScene3D(gl, programInfo, buffers){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    // *** CAN I MOVE THE FUNCTIONS INTO THE PERSEPECTIVE CALL ??? ***
    // Create a perspective matrix that simulates the distortion of perspective in a camera.
    const fieldOfView = (45 * Math.PI) / 180;                       // Radians (FOV 45 degrees)
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;  // width/height ratio that matches the display size of the canvas
    const zNear = 0.1;                                              // Show objects farther than 0.1 units
    const zFar = 100.0;                                             // Show objects closer than 100 units 
    const projectionMatrix = mat4.create();
    // Link for perspective
    mat4.perspective(     
        projectionMatrix, 
        fieldOfView, 
        aspect, 
        zNear, 
        zFar,
    );

    // Determines shows on the canvas
    const modelViewMatrix = mat4.create();

    mat4.translate(
        modelViewMatrix,    // Matrix Destination
        modelViewMatrix,    // Matrix to Modify
        [-0.0, 0.0, -6.0],  // Modifications
    );

    // Tell WebGL how to pull out the positions from position buffer
    // into the vertexPosition attribute
    setPositionAttribute(gl, buffers, programInfo);
    setColorAttribute(gl, buffers, programInfo);
    // Tell WebGL to use our program to use program when drawing
    gl.useProgram(programInfo.program);

    // Set the Shader Uniform
    // uniform matrix link
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

    // Whats this
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }

}



function setPositionAttribute(gl, buffers, programInfo){
    const numComponents = 2 // pull out 2 values per iteration
    const type = gl.FLOAT;  // the data in the buffer is 32bit floats
    const normalize = false;// dont normalize
    const stride = 0;       // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0        // how many bytes inside the buffer to start from

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

export { drawScene3D };
