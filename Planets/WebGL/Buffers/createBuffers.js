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
    gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.DYNAMIC_DRAW);
    return transformBuffer;
}

// check buffers.js to see it used.
function createVAO(gl, data, helperFn){
    return helperFn(
        gl,
        createVertexBuffer(gl, data.vData),
        createIndexBuffer(gl, data.iData),
        createTransformBuffer(gl, data.tData)
    )
}

export { createVAO }