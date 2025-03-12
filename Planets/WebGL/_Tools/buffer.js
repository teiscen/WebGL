/*
 * Used by the "OBJECTS" _Buffer files to create the buffers
 */
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

/**
 * @param {glContext} gl
 * @param {{vData: Float32Array, iData: Uint32Array, tData: Float32Array}} data 
 * @param {*} Function takes in gl, with buffers and creates the VAO object
 * @returns VAO object
 */
function createVao(gl, data, vaoFn){
    return vaoFn(
        gl,
        createVertexBuffer(gl, data.vData),
        createIndexBuffer(gl, data.iData),
        createTransformBuffer(gl, data.tData)
    )
}

export { createVao }