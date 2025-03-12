import { VertexDataFactory, IndexDataFactory, TranslationMatrixFactory } from "../../Planets/WebGL/_Tools/factory.js";
import { createVAO } from "../../Planets/WebGL/_Tools/buffer.js";
import { Galaxy } from "../../Planets/Logic/Galaxy.mjs";

//Responsible for setting up the buffers that communicate with the webgl
//NOTE - Need to rework how this works as the drawingo and whatnot is flawed
class Buffer{
    //NOTE - Should consider moving galaxy, player etc functions once we get to it.
    constructor(galaxy, players, circleStepCount){
        this.galaxy = galaxy;
        this.players = players;
        this.circleStepCount = circleStepCount;
    }

    getGalaxyDrawInfo(gl) {
        let data = this.createGalaxyData();

        return {
            vao:        this.createGalaxyVAO(gl),
            idxCount:   data.iData.length,
            insCount:   data.tData.length/8
        };
    }
    /**
     * Returns BufferObj{vData, iData, tData} all in Float32Array
     * vData: Circle Vertex Data, [x, y, z, r, g, b, a]
     * iData: Indices to create a circle using gl_Triangle //NOTE - Not actually sure about this
     * tData: Radius, Color, Posn, [R, x, y, z, r, g, b, a]
     */
     createGalaxyData(){
        let transforms = [];
        let cBodies = this.galaxy.getCelestialBodies();
        cBodies.forEach(cBody => {
            // Transforms: Scale(radius), Posn, Color
            let transform = [cBody.radius, ...cBody.posn, ...cBody.color];
            transforms.push(...transform);
        });

        let vData = VertexDataFactory.genCircle(this.circleStepCount);
        let iData = IndexDataFactory.genCircle(this.circleStepCount);
        let tData = new Float32Array(transforms);

        return { vData: vData, iData: iData, tData: tData };
    }   

    // This calls createVAO in createBuffers.js
    // It takes in the data in their proper uint or float form
    // it also takes a helper function that formates the buffes correctly
    // it then passed back the VAO
    /**
     * Takes in:
     * vertex index and transform data
     * Functions that sets up the bindings
     */
    createGalaxyVAO(gl){
        return createVAO(gl, this.createGalaxyData(), this.galaxyVaoHelper);
    }
    
    galaxyVaoHelper(gl, vBuffer, iBuffer, tBuffer){
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4*7, 0);   // Posn (loc=0)
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 4*7, 4*3); // Color(loc=1)
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
        gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 4*8, 0);   // Radius (Scale)
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 4*8, 4*1); // Posn
        gl.vertexAttribPointer(4, 4, gl.FLOAT, false, 4*8, 4*4); // Color()
        
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);
        gl.enableVertexAttribArray(3);
        gl.enableVertexAttribArray(4);
    
        // How much each instance advances the transform buffers
        // each transform buffer is unique so they each advance once
        gl.vertexAttribDivisor(2, 1);
        gl.vertexAttribDivisor(3, 1);
        gl.vertexAttribDivisor(4, 1);
    
        gl.bindVertexArray(null);
        return vao;
    }



}
 
export { Buffer }