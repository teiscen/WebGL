import { Buffer } from "./Buffers/buffers.js";
import { shaderProgram } from "./Shaders/shaderCode.js";
import { bindUniform } from "./Uniform/uniforms.js";
import { Galaxy } from "../Logic/Galaxy.mjs" // Why isnt Celestial Body imported here?
import { CelestialBody } from "../Logic/Planet.mjs" // Why isnt Celestial Body imported here?


main();


async function main(){
    const canvas = document.getElementById("canvas-gl");
    const gl = canvas.getContext("webgl2");
    
    if (gl === null) {
        alert("Unable to initialize WebGL.");
        return;
    }
    
    // Default
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    
    // Set up Uniforms
    // Enabled the 2 matrices later 
    const shader = shaderProgram(gl);
    gl.useProgram(shader.program);    
    bindUniform(gl, shader); // Currently a mess need to fix up
    
    //Bottom right is + +, top left is - -
    //Earth is going ccw, mars is cw
    const sun   = new CelestialBody("Sun",  vec3.fromValues(0.0, 0.0, 0.0), 50, [1.0, 1.0, 0.0, 1.0],    30,  vec3.fromValues(0.0, 0.0, 0.0));
    const earth = new CelestialBody("Earth",vec3.fromValues(1.3, -1.3, 0.0), 2,  [0.25, 0.88, 0.82, 1.0], 10,  vec3.fromValues(10.0, 10.0, 0.0));
    const mars  = new CelestialBody("Mars", vec3.fromValues(-1.0, 1.0, 0.0), 1,  [0.69, 0.19, 0.38, 1.0], 5,   vec3.fromValues(50.0, 50.0, 0.0));
    
    let galaxy = new Galaxy("Milk Way", 1, 1);
    galaxy.addCelestialBody(sun); galaxy.addCelestialBody(earth); galaxy.addCelestialBody(mars);
    
    const buffer = new Buffer(galaxy, -1, 30);
    
    
    // when yuou add the other things to render need to change this so it calls the general get info
    // const drawInfo = buffer.getDrawInfo(gl);
    const drawInfo = [];
    
    while(true){
        await delay(500); // Delay before each iteration
    // for(let i = 0; i < 100; i++){
        console.clear();
        console.log(galaxy.toString());
        galaxy.update();        
        drawInfo.push(buffer.getGalaxyDrawInfo(gl));
        drawInfo.forEach((value) => {
            gl.bindVertexArray(value.vao);
            gl.drawElementsInstanced(gl.TRIANGLES, value.idxCount, gl.UNSIGNED_INT, 0, value.insCount);
            gl.bindVertexArray(null);
        });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
