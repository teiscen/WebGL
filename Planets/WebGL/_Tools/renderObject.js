class RenderObject {
    /*
        Needs:
            shader
            buffers (vao?)
            
            draw
            initializtion
            update
    */

    /**
     * For instanced drawing, a mock of it to show what to do
     */
    draw(gl){
        let data = {
            vData: VertexDataFactory.genCircle(this.circleStepCount),
            iData: IndexDataFactory.genCircle(this.circleStepCount),
            tData: new Float32Array(transforms)
        }

        let value = {
            vao:        this.createGalaxyVAO(gl),
            idxCount:   data.iData.length,
            insCount:   data.tData.length/8
        }
        gl.bindVertexArray(value.vao);
        gl.drawElementsInstance(gl.TRIANGLES, value.idxCount, gl.UNSINED_INT, 0, value.insCount);
        gl.bindVertexArray(null);
    }



    /**
     * Create the components necessary to call draw
     */
    init(){


    }

    /**
     * Varies the most from object to object
     * Mostly to update buffer subdata when thats implemented
     * instead of recreating it every time
     */
    update(){

    }

    
}