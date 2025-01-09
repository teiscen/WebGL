
function bindUniform(gl, shader, {rows, cols}){
    const left = 0;
    const right = gl.canvas.clientWidth;
    const top = 0;
    const bottom = gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.ortho(
        projectionMatrix,
        left,   // left edge of the orthogonal projection
        right,  // right edge of the orthogonal projection
        bottom, // bottom edge
        top,    // top edge
        zNear,  // near plane (to avoid clipping issues with objects close to camera)
        zFar    // far plane (objects further away can be clipped here)
    );
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
        // [0.0, 0.0, -50.0],  // Translation
        [0.0, 0.0, -1],  // Rotation
        // [0.0, 0.0, -90.0],  // Scale
    );
    gl.uniformMatrix4fv(
        shader.uniformLocations.uModelViewMatrix,
        false,
        modelViewMatrix,
    );


    // Because the size of the array is actually 2x2 (-1 to 1)
    // you need to scale down size (in shader)

    const cellWidth = gl.canvas.clientWidth / cols;
    const cellHeight = gl.canvas.clientHeight / rows;

    const cellSize = Math.min(cellWidth, cellHeight);
    gl.uniform1f(shader.uniformLocations.uScale, cellSize);
}

export {bindUniform}