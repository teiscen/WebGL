const WHITE = [1.0, 1.0, 1.0, 1.0];
const BLACK = [0.0, 0.0, 0.0, 1.0];
const BLUE  = [0.0, 0.0, 1.0, 1.0];
const NORTH = 0b1000;
const EAST  = 0b0100;
const SOUTH = 0b0010;
const WEST  = 0b0001;
const OFFSET = 0.05;

// Model Data
const vertexData = new Float32Array([
    //x     y
    // Outer Square
     1.0,  1.0, 0.0, ...BLACK, // Top Right
    -1.0,  1.0, 0.0, ...BLACK, // Top Left
    -1.0, -1.0, 0.0, ...BLACK, // Bot Left
     1.0, -1.0, 0.0, ...BLACK, // Bot Right
    // Inner Square
     1.0 - OFFSET,  1.0 - OFFSET, 0.0, ...BLACK, // 4 
    -1.0 + OFFSET,  1.0 - OFFSET, 0.0, ...BLACK,
    -1.0 + OFFSET, -1.0 + OFFSET, 0.0, ...BLACK,
     1.0 - OFFSET, -1.0 + OFFSET, 0.0, ...BLACK,

    // Outer Square
     1.0,  1.0, 0.1, ...WHITE, // 8
    -1.0,  1.0, 0.1, ...WHITE,
    -1.0, -1.0, 0.1, ...WHITE,
     1.0, -1.0, 0.1, ...WHITE,
]);
// Top Right CCW
// If deciding to remove the cells underneath noWallModel from each
const southernWallIndices = new Uint16Array([
    7, 6, 2,
    2, 3, 7, 
]);
// ^^^ Helper
const noWallIndices = new Uint16Array([
    8,  9, 10,
    10, 11, 8,
]);
const singleWallIndices = new Uint16Array([
    ...noWallIndices,
    0, 1, 5,
    4, 5, 0,
]);
const doubleWallIndices = new Uint16Array([
    ...singleWallIndices,
    0, 4, 7, 
    7, 3, 0,
]);
const seperateWallIndices = new Uint16Array([
    ...singleWallIndices,
    ...southernWallIndices,
]);
const tripleWallIndices = new Uint16Array([
    ...doubleWallIndices,
    ...southernWallIndices,
]);
const fullWallIndices = new Uint16Array([
    ...tripleWallIndices,
    5, 1, 2,
    2, 6, 5,
]);

// Transform Buffers
// Offset(Position) Rotation(Angle) + InnerColor
const noWallTrans = [];
const singleWallTrans = [];
const doubleWallTrans = [];
const seperateWallTrans = [];
const tripleWallTrans = [];
const fullWallTrans = [];
// Lookup: gives which buffer it belongs to + Rotation
const container = new Map();
container
    // No Wall
    .set(0b0000, {buffer: noWallTrans,        rotation: 0.0})
    //  Single
    .set(0b1000, {buffer: singleWallTrans,    rotation: 0.0})           // No Rotation
    .set(0b0100, {buffer: singleWallTrans,    rotation: -Math.PI/2})    // (-)CW 90 
    .set(0b0010, {buffer: singleWallTrans,    rotation: Math.PI})       // CCW 180 
    .set(0b0001, {buffer: singleWallTrans,    rotation: Math.PI/2})     // CCW 90
    //  Double
    .set(0b1100, {buffer: doubleWallTrans,    rotation: 0.0})
    .set(0b0110, {buffer: doubleWallTrans,    rotation: -Math.PI/2})
    .set(0b0011, {buffer: doubleWallTrans,    rotation: Math.PI})
    .set(0b1001, {buffer: doubleWallTrans,    rotation: Math.PI/2})
    //  Double Seperate
    .set(0b1010, {buffer: seperateWallTrans,  rotation: 0.0})
    .set(0b0101, {buffer: seperateWallTrans,  rotation: -Math.PI/2})
    //  Triple
    .set(0b1110, {buffer: tripleWallTrans,    rotation: 0.0})
    .set(0b0111, {buffer: tripleWallTrans,    rotation: -Math.PI/2})
    .set(0b1011, {buffer: tripleWallTrans,    rotation: Math.PI})
    .set(0b1101, {buffer: tripleWallTrans,    rotation: Math.PI/2})
    //  All Walls
    .set(0b1111, {buffer: fullWallTrans,      rotation: 0.0})


// Set up Buffers
function createIndexBuffer(gl, indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return indexBuffer;
}

function createTransformBuffer(gl, transforms) {
    
    const transformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(transforms), gl.STATIC_DRAW);
    return transformBuffer;
}

function createVAO(gl, vertexBuffer, indexBuffer, transformBuffer) {
    // gl.FLOAT is 4 bytes
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4*7, 0); // Posn (loc=0)
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 4*7, 4*3); // Color(loc=1)

    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 4*7, 0); // Vec2 Posn
    gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 4*7, 4*2); // Rotation Angle
    gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 4*7, 4*3); // Color(to mult)
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, )

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


function initMazeBuffer(gl, maze){
    let count = 0;
    maze.cellArray.forEach((value) => {
        value.forEach((value) => {
            count++;
            let position = value.coordinate;
            let object = container.get(value.walls);
            // console.log(object.buffer);
            object.buffer.push(
                position.col + 0.0, position.row + 0.0, object.rotation, ...BLUE
            );
        });
    });

    // console.log(count);
    //vertexData
    const vertexBuffer = gl.createBuffer();

    return{
        noWall:      createVAO(gl, vertexBuffer, createIndexBuffer(gl, noWallIndices),       createTransformBuffer(gl, noWallTrans)),
        singleWall:  createVAO(gl, vertexBuffer, createIndexBuffer(gl, singleWallIndices),   createTransformBuffer(gl, singleWallTrans)),
        doubleWall:  createVAO(gl, vertexBuffer, createIndexBuffer(gl, doubleWallIndices),   createTransformBuffer(gl, doubleWallTrans)),
        seperateWall:createVAO(gl, vertexBuffer, createIndexBuffer(gl, seperateWallIndices), createTransformBuffer(gl, seperateWallTrans)),
        tripleWall:  createVAO(gl, vertexBuffer, createIndexBuffer(gl, tripleWallIndices),   createTransformBuffer(gl, tripleWallTrans)),
        fullWall:    createVAO(gl, vertexBuffer, createIndexBuffer(gl, fullWallIndices),     createTransformBuffer(gl, fullWallTrans)),
    }
}

function getDrawDetails(gl, maze) {
    let vao = initMazeBuffer(gl, maze);
    let arr = [
        // { ind: noWallIndices.length,        tran: noWallTrans.length        ,vao: vao.noWall        },
        // { ind: singleWallIndices.length,    tran: singleWallTrans.length    ,vao: vao.singleWall    },
        // { ind: doubleWallIndices.length,    tran: doubleWallTrans.length    ,vao: vao.doubleWall    },
        // { ind: seperateWallIndices.length,  tran: seperateWallTrans.length  ,vao: vao.seperateWall  },
        // { ind: tripleWallIndices.length,    tran: tripleWallTrans.length    ,vao: vao.tripleWall    },
        // { ind: fullWallIndices.length,      tran: fullWallTrans.length      ,vao: vao.fullWall      },
        { ind: noWallIndices,       tran: noWallTrans        ,vao: vao.noWall        },
        { ind: singleWallIndices,   tran: singleWallTrans    ,vao: vao.singleWall    },
        { ind: doubleWallIndices,   tran: doubleWallTrans   ,vao: vao.doubleWall    },
        { ind: seperateWallIndices,  tran: seperateWallTrans  ,vao: vao.seperateWall  },
        { ind: tripleWallIndices,   tran: tripleWallTrans   ,vao: vao.tripleWall    },
        { ind: fullWallIndices,     tran: fullWallTrans      ,vao: vao.fullWall      },
    ];
    return arr;
}


export { initMazeBuffer, getDrawDetails, vertexData };

