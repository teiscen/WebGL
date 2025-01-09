import { initBuffers } from "./init-buffers.js";
import { drawScene3D } from "./draw-scene.js";

main();

// Called when script is loaded.
// Set up WebGL context and start rendering
function main(){

    // 1. Set Up WebGL
    const canvas = document.getElementById("canvas-gl");
    console.log(canvas);
    const gl = canvas.getContext("webgl");
    
    if (gl === null) {
        alert("Unable to initialize WebGL.");
        return;
    }

    // 2. Set up WebGL Rendering
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    /*
        Vertex Shader:
        runs for each vertex in the shape
        input vertext into clip space(-1 to 1 range)
        Must:
        perform transformations to the vertex position
        return transfomed vertex by saving it to gl_Position
        Can:
        Apply normals to determine lighting
        info is stored into 
        varyings (write in vertex read in fragment shaders) or 
        attributes
    */
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
        }
    `;

    /*
    Fragment Shader:
    after Vertex shader
    called for every pixel on every shape to be drawn
    determine color of the pixel based on factos like lighting
    */
    const fsSource = `
        varying lowp vec4 vColor;

        void main(void) {
            gl_FragColor = vColor;
        }
  `;


    // 2.a Set up Shader
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Object to store the shader components, gives access to where they are
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl);

    // Draw the scene
    drawScene3D(gl, programInfo, buffers);
}

// Method to intialize the shaders
function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
          `Unable to initialize the shader program: ${gl.getProgramInfoLog(
            shaderProgram,
          )}`,
        );
        return null;
      }
    
    return shaderProgram;
}

function loadShader(gl, type, source){
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(
          `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
        );
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;

}

