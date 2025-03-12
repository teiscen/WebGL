// Tools
import { VertexDataFactory, IndexDataFactory, TranslationMatrixFactory } from "../../Planets/WebGL/_Tools/factory.js";
import { createVAO } from "../../Planets/WebGL/_Tools/buffer.js";
import { initShaderProgram } from "../../Planets/WebGL/_Tools/shader.js";
import { bindUniform } from "../../Planets/WebGL/_Tools/uniform.js";
// Galaxy 
import { Buffer } from "../../Old_Code/Galaxy_Old/buffer.js";
import { shaderProgram } from "../../Old_Code/Galaxy_Old/shader.js";
// VelocityIndicator
// import { shaderProgram }from "./velocities/buffer.js";
// import { shaderProgram }from "./velocities/shader.js";
// Logic
import { Galaxy }        from "../../Planets/Logic/Galaxy.mjs" // Why isnt Celestial Body imported here?
import { CelestialBody } from "../../Planets/Logic/Planet.mjs" 

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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
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
    //                              name    initialVel                      mass   color                   radius initialPosn: any
    const sun   = new CelestialBody("Sun",  vec3.fromValues(0.0, 0.0, 0.0),  100,  [1.0, 1.0, 0.0, 1.0],    80,    vec3.fromValues(0.0, 0.0, 0.0));
    const earth = new CelestialBody("Earth",vec3.fromValues(.8,  0.8, 0.0),   50,  [0.25, 0.88, 0.82, 1.0], 10,    vec3.fromValues(50, -50 , 0));
    const mars  = new CelestialBody("Mars", vec3.fromValues(.5, -0.5, 0.0),    5,  [0.69, 0.19, 0.38, 1.0], 5,     vec3.fromValues(120, 120, 0));
    
    let galaxy = new Galaxy("Milk Way", 2 , 1);
    galaxy.addCelestialBody(sun); galaxy.addCelestialBody(earth); galaxy.addCelestialBody(mars);
    
    const buffer = new Buffer(galaxy, -1, 30);

    
    // when yuou add the other things to render need to change this so it calls the general get info
    // const drawInfo = buffer.getDrawInfo(gl);
    let drawInfo = [];
    
    let i = true
    while(i){
        // i++;
        await delay(16); // Delay before each iteration
    // for(let i = 0; i < 100; i++){
        // console.clear();
        // console.log(galaxy.toString());

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        galaxy.update();        
        drawInfo = [];
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
