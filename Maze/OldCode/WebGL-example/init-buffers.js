function initBuffers(gl){
    const positionBuffer = initPositionBuffer(gl);
    const colorBuffer = initColorBuffer(gl);
    return {
        position: positionBuffer,
        color: colorBuffer,
    };
}

function initPositionBuffer(gl){
    // Creates a buffer to hold square position
    const positionBuffer = gl.createBuffer();

    /*
        Other sorts of buffers: 

        When you bind a buffer and subsequent changes (ie. gl.bufferData())
        are applied to the currently bound buffer. 
        Changes to positions array dont reflect to WebGL, for it to update:
            gl.bindBuffer();
            gl.BufferData();
        
    */
   const positions = [
        1.0, 1.0,       // top right
        -1.0, 1.0,      // top left
        1.0, -1.0,      // bottom right
        //  -1.0, -1.0
    ];
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initColorBuffer(gl){
    const colors = [
        //R   G    B    A
        // 1.0, 1.0, 1.0, 1.0, // White
        // 1.0, 1.0, 1.0, 1.0, // White
        // 1.0, 1.0, 1.0, 1.0, // White
        1.0, 0.0, 0.0, 1.0, // Red
        0.0, 1.0, 0.0, 1.0, // Green
        0.0, 0.0, 1.0, 1.0, // Blue
        1.0, 1.0, 1.0, 1.0, // White
    ];

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return colorBuffer;
}
export { initBuffers };
