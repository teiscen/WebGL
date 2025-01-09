const WHITE = [1.0, 1.0, 1.0, 1.0];
const BLACK = [0.0, 0.0, 0.0, 1.0];
const BLUE  = [0.0, 0.0, 1.0, 1.0];
const OFFSET = 0.3;

const vertexData = new Float32Array([
    //x     y
    // Outer Square Black
     1.0,  1.0, 0.0, ...BLACK, // Top Right
    -1.0,  1.0, 0.0, ...BLACK, // Top Left
    -1.0, -1.0, 0.0, ...BLACK, // Bot Left
     1.0, -1.0, 0.0, ...BLACK, // Bot Right
    // Inner Square
     1.0 - OFFSET,  1.0 - OFFSET, 0.0, ...BLACK, // 4 
    -1.0 + OFFSET,  1.0 - OFFSET, 0.0, ...BLACK,
    -1.0 + OFFSET, -1.0 + OFFSET, 0.0, ...BLACK,
     1.0 - OFFSET, -1.0 + OFFSET, 0.0, ...BLACK,

    // Outer Square White
     1.0,  1.0, -0.1, ...WHITE, // 8
    -1.0,  1.0, -0.1, ...WHITE,
    -1.0, -1.0, -0.1, ...WHITE,
     1.0, -1.0, -0.1, ...WHITE,
]);

class Transforms{
    constructor() {
        this.none = [];
        this.single = [];
        this.double = [];
        this.seperate = [];
        this.triple = [];
        this.full = [];

        this.container = new Map();

        // No Wall
        this.setMap(0b0000, this.none, 0.0);
        // Single Walls
        this.setMap(0b1000, this.single, 0.0);            // No Rotation
        this.setMap(0b0100, this.single, -Math.PI / 2);   // (-)CW 90
        this.setMap(0b0010, this.single, Math.PI);        // CCW 180
        this.setMap(0b0001, this.single, Math.PI / 2);    // CCW 90
        // Double Walls
        this.setMap(0b1100, this.double, 0.0);
        this.setMap(0b0110, this.double, -Math.PI / 2);
        this.setMap(0b0011, this.double, Math.PI);
        this.setMap(0b1001, this.double, Math.PI / 2);
        // Double Separated Walls
        this.setMap(0b1010, this.seperate, 0.0);
        this.setMap(0b0101, this.seperate, -Math.PI / 2);
        // Triple Walls
        this.setMap(0b1110, this.triple, 0.0);
        this.setMap(0b0111, this.triple, -Math.PI / 2);
        this.setMap(0b1011, this.triple, Math.PI);
        this.setMap(0b1101, this.triple, Math.PI / 2);
        // All Wall
        this.setMap(0b1111, this.full, 0.0);
    }

    setMap(binary, transformArray, rotation) {
        this.container.set(binary, { transformArray, rotation });
    }

    addTransform(wall, position){
        let obj = this.container.get(wall);
        obj.transformArray.push(
            position.col, position.row, obj.rotation, ...WHITE,
        );
    }

    getTransformArray(binary){
        return this.container.get(binary).transformArray;
    }
}

class Indicies{
    constructor(){
        // Helper: Not used alone by index buffer
        this.southernWall = new Uint32Array([
            7, 6, 2,
            2, 3, 7, 
        ]);
        // Order: Top Right CCW
        // If deciding to remove the cells underneath noWallModel from each
        this.none = new Uint32Array([
            8,  9, 10,
            10, 11, 8,
        ]);
        this.single = new Uint32Array([
            ...this.none,
            0, 1, 5,
            4, 5, 0,
        ]);
        this.double = new Uint32Array([
            ...this.single,
            0, 4, 7, 
            7, 3, 0,
        ]);
        this.seperate = new Uint32Array([
            ...this.single,
            ...this.southernWall,
        ]);
        this.triple = new Uint32Array([
            ...this.double,
            ...this.southernWall,
        ]);
        this.full = new Uint32Array([
            ...this.triple,
            5, 1, 2,
            2, 6, 5,
        ]);

        this.container = new Map()
        this.setMap(0b0000, this.none);

        this.setMap(0b1000, this.single);
        this.setMap(0b0100, this.single);
        this.setMap(0b0010, this.single);
        this.setMap(0b0001, this.single);
        
        this.setMap(0b1100, this.double);
        this.setMap(0b0110, this.double);
        this.setMap(0b0011, this.double);
        this.setMap(0b1001, this.double);
        
        this.setMap(0b1010, this.seperate);
        this.setMap(0b0101, this.seperate);
        
        this.setMap(0b1110, this.triple);
        this.setMap(0b0111, this.triple);
        this.setMap(0b1011, this.triple);
        this.setMap(0b1101, this.triple);
        
        this.setMap(0b1111, this.full);
    }

    setMap(binary, indexArray){
        this.container.set(binary, indexArray);
    }

    getIndexArray(binary){
        return this.container.get(binary);
    }
}

/**
 * Vertex and Index Data are in Float32 and Uint8 respectively,
 * Transform Data is not and needs to adjusted.
 */
class BufferData{
    constructor(){
        this.vertexData = vertexData;
        this.transformData = new Transforms;
        this.indexData = new Indicies;
    }

    getBufferData(binary){
        return{
            vData: this.vertexData,
            iData: this.indexData.getIndexArray(binary),
            tData: this.transformData.getTransformArray(binary),
        };
    }

    getBufferDataArray(){
        const bufferDataArray = [];
        const defaultValues = [
           0b0000,
           0b1000,
           0b1100,
           0b1010,
           0b1110,
           0b1111,
        ];

        defaultValues.forEach((value) => {
            bufferDataArray.push(this.getBufferData(value))
        });

        return bufferDataArray;
    }
}

export { BufferData }