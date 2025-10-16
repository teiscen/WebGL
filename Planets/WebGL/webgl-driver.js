import { Galaxy as glGalaxy } from "./Galaxy/galaxy.js";

import { CelestialBody } from "../Logic/Planet.js";
import { Galaxy as logGalaxy } from "../Logic/Galaxy.js"

import { vec3 } from "../../node_modules/gl-matrix/esm/index.js";
import {logDebug, downloadLogs} from "./_Tools/debug.js" 

import { ThreeBodyInitials, generateGalaxy } from "../Logic/ThreeBody.js";

main();

async function main(){
/* -------------------------  WEBGL DEFAULT SET-UP   ------------------------ */
    const canvas = document.getElementById("canvas-gl");
    const gl = canvas.getContext("webgl2");
    
    if (gl === null) {
        alert("Unable to initialize WebGL.");
        return;
    }
    
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

/* -----------------------------  LOGIC SET-UP   ---------------------------- */
    // Bottom right is + +, top left is - -
    // Earth is going ccw, mars is cw
    //                              name    initialVel                      mass   color                    radius initialPosn: any
    // const sun   = new CelestialBody("Sun",  vec3.fromValues(0.0, 0.0, 0.0),  100,  [1.0, 1.0, 0.0, 1.0],    20,    vec3.fromValues(0.0, 0.0, 0.0));
    // const earth = new CelestialBody("Earth",vec3.fromValues(.8,  0.8, 0.0),  200,  [0.25, 0.88, 0.82, 1.0], 10,    vec3.fromValues(50, -50 , 0));
    // const mars  = new CelestialBody("Mars", vec3.fromValues(.5, -0.5, 0.0),    5,  [0.69, 0.19, 0.38, 1.0], 5,     vec3.fromValues(120, 120, 0));
    
    // let galaxy = new logGalaxy("Milk Way", 1 , 1);
    // galaxy.addCelestialBody(sun); galaxy.addCelestialBody(earth); galaxy.addCelestialBody(mars);
    let tb = ThreeBodyInitials.get("Figure 8")
    let posn = tb.positions 
    let vel =  tb.velocities
    let galaxy = generateGalaxy(posn, vel)

    console.log(galaxy.toString())

/* ------------------------- WEBGL LOGIC INTEGRATION ------------------------ */
    let galaxyGl = new glGalaxy();
    galaxyGl.init(gl, galaxy, 30);

    // console.log(galaxyGl);

/* -----------------------------   RENDER LOOP   ----------------------------- */
    for(let i = 0; i < 600; i++){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        galaxy.update();        
        // drawInfo = []; // When there are more thing to draw then it could be worth it to push them into here and then draw them
        galaxyGl.updateTransforms();
        galaxyGl.draw();        
        await delay(16);
        // logDebug(mars.toString());
    }
    // downloadLogs();
    
    // ThreeBodyInitials.forEach(async (body) => {
    //     let gal = generateGalaxy(body.positions, body.velocities);
    //     let galGl = new glGalaxy();
    //     galGl.init(gl, gal, 30);

    //     // console.log(gal.toString())
        
    //     for(let i = 0; i < 300; i++){
    //        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //         gal.update();        
    //         galGl.updateTransforms();
    //         galGl.draw();        
    //         await delay(16); 
    //     }
    // })
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
