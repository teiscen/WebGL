function createVertexBuffer(gl, vertexData) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    return vertexBuffer;
}

function createIndexBuffer(gl, indexData) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
    return indexBuffer;
}

function createTransformBuffer(gl, transformData) {
    const transformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(transformData), gl.STATIC_DRAW);
    return transformBuffer;
}

function createVAO(gl, vertexData, indexData, transformData){
    return createVAOHelper(
        gl,
        createVertexBuffer(gl, vertexData),
        createIndexBuffer(gl, indexData),
        createTransformBuffer(gl, transformData),
    );
}

function createVAOHelper(gl, vertexBuffer, indexBuffer, transformBuffer) {
    // gl.FLOAT is 4 bytes
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4*7, 0);   // Posn (loc=0)
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 4*7, 4*3); // Color(loc=1)
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4*7, 0);   // Vec2 Posn
    gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 4*7, 4*2); // Rotation Angle
    gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 4*7, 4*3); // Color(to mult)
    

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);

    gl.vertexAttribDivisor(2, 1);
    gl.vertexAttribDivisor(3, 1);
    gl.vertexAttribDivisor(4, 1);

    gl.bindVertexArray(null);
    return vao;
}


export { createVAO }