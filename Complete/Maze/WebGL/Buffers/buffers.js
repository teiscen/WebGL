import { BufferData } from "./bufferCode.js";
import { createVAO } from "./createBuffers.js";

/**
 * Currently only renders the final maze
 * Need to rethink how the bufferData is accessed: currently doing it by default values which feels off (getBufferDataArray)
 */
class Buffer{
    constructor(){
        this.transformDataSet = false;
        this.bufferData = new BufferData;
    }

    setTransformData(maze){
        maze.cellArray.forEach((value) => {
            value.forEach((value) => {
                this.bufferData.transformData.addTransform(value.walls, value.coordinate);

            });
        });
        this.transformDataSet = true;
    }

    /**
     * Might need to change insCount to just length
     * returns array containing vao + idx and ins Count
     */
    getDrawInfo(gl){
        if(!this.transformDataSet){
            console.log("Tranform Data has not been set.");
            return;
        }

        const dataArray = this.bufferData.getBufferDataArray();
        const vaoArray = [];
        dataArray.forEach((value) => {
            vaoArray.push({
                vao:        createVAO(gl, value.vData, value.iData, value.tData),
                idxCount:   value.iData.length,
                insCount:   (value.tData.length === 0) ? 0 : value.tData.length/7,
            })
        });

        return vaoArray;
    }
}

export { Buffer }