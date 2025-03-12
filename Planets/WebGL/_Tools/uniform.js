import { mat4 } from "../../../node_modules/gl-matrix/esm/index.js"

class OrthoFactory {
    // top left is 0,0
    static orthoDefault(gl, zoom = 1.0){
        const data = {
            left:     0 * zoom,
            right:    gl.canvas.clientWidth * zoom,
            top:      0  * zoom,
            bottom:   gl.canvas.clientHeight  * zoom,
            zNear:    0.1,//  * zoom  * zoom,
            zFar:     100.0
        }
        
        return createProjectionMatrix(data);
    }

    // centered on 0,0
    static orthoCentered(gl, zoom){
        const data = {
            left:    (-gl.canvas.clientWidth  / 2) * zoom,
            right:   ( gl.canvas.clientWidth  / 2) * zoom,
            top:     ( gl.canvas.clientHeight / 2) * zoom,
            bottom:  (-gl.canvas.clientHeight / 2) * zoom,
            zNear:   0.1,
            zFar:    100.0
        }

        return this.createProjectionMatrix(data);
    }

    //TODO - Check if this is compatible with the other views
    static createProjectionMatrix(data){
        const projectionMatrix = mat4.create();
        mat4.ortho(
            projectionMatrix,
            data.left,   // left edge of the orthogonal projection
            data.right,  // right edge of the orthogonal projection
            data.bottom, // bottom edge
            data.top,    // top edge
            data.zNear,  // near plane (to avoid clipping issues with objects close to camera)
            data.zFar    // far plane (objects further away can be clipped here)
        );
        return projectionMatrix;
    }
}

export {OrthoFactory}