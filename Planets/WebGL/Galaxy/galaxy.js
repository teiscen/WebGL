import { Shader  } from "./shader.js"
import { Uniform } from "./uniform.js"
import { Buffer  } from "./buffer.js"
import { VertexDataFactory, IndexDataFactory } from "../_Tools/factory.js";

/**
 * TODO: Decide if its going to hold a copy of Galaxy (Logic), or will need it passed in. For now holds a copy.
 */
class Galaxy {

    /**
     * Creates Everything needed to render to canvas.
     * Shaders, uniforms, vertex index and transfrom buffers in the form of VAO
     */
    init(gl, galaxy, circleStepCount){
        this.gl = gl;
        this.galaxy = galaxy;
        this.circleStepCount = circleStepCount;
        
        this.shaderProgram = Shader.shaderProgram(gl);
        
        // this.getVao(galaxy, gl);
        this.getVao();
    }
    
    // draw(gl){
    draw(){
        this.gl.useProgram(this.shaderProgram.program);
        Uniform.bindUniform(this.gl, this.shaderProgram);
        
        let idxCount = this.data.iData.length;
        let insCount = this.data.tData.length / 8; // each instnce requires 7 values from transforms


        this.gl.bindVertexArray(this.vao);
        // gl.drawElementsInstanced(gl.TRIANGLES, idxCount, gl.UNSIGNED_INT, 0, insCount);
        this.gl.drawElementsInstanced(this.gl.TRIANGLES, idxCount, this.gl.UNSIGNED_INT, 0, insCount);
        this.gl.bindVertexArray(null);
    }


    // Need to come up with a better name
    getVao() {
        this.data = this.createBufferArray();
        this.vao = Buffer.createVao(this.gl, this.data);
    }

    /**
     * Logical Representation
     */
    createBufferArray(){
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

    /**
     * Will update buffer subdata.
     * For Now simply just redoes the buffer
     */
    updateTransforms(){
        this.data = this.createBufferArray();
        this.vao = Buffer.createVao(this.gl, this.data);
    }
}

export { Galaxy }