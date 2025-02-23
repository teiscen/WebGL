const WHITE     = [1.0, 1.0, 1.0, 1.0];
const BLACK     = [0.0, 0.0, 0.0, 1.0];

const RED       = [1.0, 0.0, 0.0, 1.0];
const GREEN     = [0.0, 1.0, 0.0, 1.0];
const BLUE      = [0.0, 0.0, 1.0, 1.0];

const YELLOW    = [1.0, 1.0, 0.0, 1.0];
const CYAN      = [0.0, 1.0, 1.0, 1.0];
const MAGENTA   = [1.0, 0.0, 1.0, 1.0];

//TODO - Reorganize this in a way thats better maybe a class that has vertex, tranform and index data
class VertexDataFactory {
    static genCircle(steps) {
        let vertexData = [];
        // Origin is the first point
        vertexData.push(0.0, 0.0, 0.0, ...WHITE);

        const radius = 1.0;
        //Rotate clockwise to fill in the rest
        for(let i = 0; i < steps; i++){
            let newX = radius * Math.sin(2 * Math.PI * i / steps);
            let newY = -radius * Math.cos(2 * Math.PI * i / steps);
            vertexData.push(newX, newY, 0.0, ... WHITE);
        }
        return new Float32Array(vertexData);
    }
    
    // Max Players are 6 for now
    static genPlatform(playerCount){
        let defaultColor = [
            RED, GREEN, BLUE, 
            YELLOW, CYAN, MAGENTA
        ];
        for(let i = 0 ; i < playerCount; i++){
            // Make the colors equals to defaultColor in order
        }        
    }
}

class IndexDataFactory{
    static genCircle(steps) {
        let indexData = []
        for(let i = 0; i < steps - 1; i++){
            indexData.push(0, i + 1, i + 2);
        }
        indexData.push(0, steps, 1);

        return new Uint32Array(indexData);
    }
}

//NOTE - Only for 2d operations
// Also might not be useful 
class TransformDataFactory{
    static genPlanets(){
        
    }


    static genScaleMatrix(xScale, yScale){
        return new Float32Array([
            sx, 0,  0,  0,
            0,  sy, 0,  0,
            0,  0,  1,  0,
            0,  0,  0,  1
        ])
    }

    static genRotationMatrix(angle){
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Float32Array([
            cos, -sin,  0,
            sin,  cos,  0,
            0,    0,    1
        ])
    }

    static genTranslationMatrix(xTrans, yTrans){
        return new Float32Array([
            1, 0, xTrans,
            0, 1, yTrans,
            0, 0, 1
        ])
    }
}

export { VertexDataFactory, IndexDataFactory, TransformDataFactory }