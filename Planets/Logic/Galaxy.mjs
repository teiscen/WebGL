import { CelestialBody } from "./Planet.mjs";
// import * as glMatrix from "./common.js";
import { vec3 } from 'gl-matrix';




class Galaxy{
    constructor(name, gravConst, timeStep){
        this.name = name;
        this.gravConst = gravConst;
        this.timeStep = timeStep;
        this.celestialBodies = [];
    }

    addCelestialBody(cBody){
        this.celestialBodies.push(cBody);
    }

    // Might have some merit to moving this out to CelestialBody similar to the example in the video,
    // Would provide more control over which bodies are calculated for -> might allow creating independent systems
    // that revolve around a central value
    // For simple testing this is fine and should be easy to refactor
    updateVelocities(){
        this.celestialBodies.forEach((cBody1) => {
            this.celestialBodies.forEach((cBody2) => {
                if(cBody1 != cBody2){
                    cBody1.updateVelocity(cBody2, this.gravConst, this.timeStep);
                }     
            })
        });
    }

    updatePositions(){
        this.celestialBodies.forEach((cBody) => { 
            cBody.updatePosition(this.timeStep);
        });
    }

    update(){
        this.updateVelocities();
        this.updatePositions();
    }

    //Not viable to print past 4 celestial bodies
    toString(){
        const underlineStart = '\x1b[4m';
        const underlineEnd = '\x1b[24m';
        const greenStart = '\x1b[32m';
        const magentaStart = '\x1b[35m';
        const colorEnd = '\x1b[39m';

        let cBodystr = this.celestialBodies.length == 0 ? "" : this.celestialBodies[0].toString();
                                            
        if(this.celestialBodies.length > 1){
            for(let i = 1; i < this.celestialBodies.length; i++){
                cBodystr = CelestialBody.compareCelestialBodies(cBodystr, this.celestialBodies[i].toString());
            }
        }

        const padSize = 15;
        const nameLabel         = 'Name:'.padEnd(padSize);
        const gravConstLabel    = 'GravConst:'.padEnd(padSize);
        const timeStepLabel     = 'TimeStep:'.padEnd(padSize);

        const nameValue         = this.name.padEnd(padSize);
        const gravConstValue    = this.gravConst.toString().padEnd(padSize);
        const timeStepValue     = this.timeStep.toString().padEnd(padSize);

        let galaxyStr = `${underlineStart}${greenStart}Galaxy${colorEnd}${underlineEnd}\n` 
                    + `${nameLabel}${nameValue}\n${gravConstLabel}${gravConstValue}\n${timeStepLabel}${timeStepValue}\n` 
                    + `\n${underlineStart}${magentaStart}CelestialBodies${colorEnd}${underlineEnd}\n`;
        
        return galaxyStr + cBodystr;
    }
}

//SECTION - Testing output
const sun   = new CelestialBody("Sun", 10, 3,  vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 0.0, 0.0));
const earth = new CelestialBody("Earth", 1, 1,  vec3.fromValues(1.0, 1.0, 0.0), vec3.fromValues(10.0, 10.0, 0.0));
const mars  = new CelestialBody("Mars", 1, 1,  vec3.fromValues(3.0, 3.0, 0.0), vec3.fromValues(20.0, -20.0, 0.0));

// let sunAndEarth  = CelestialBody.compareCelestialBodies(sun.toString(), earth.toString());
// let result = CelestialBody.compareCelestialBodies(sunAndEarth, mars.toString());

let galaxy = new Galaxy("Milk Way", 1, 1);
galaxy.addCelestialBody(sun); galaxy.addCelestialBody(earth); galaxy.addCelestialBody(mars);

for(let i = 0; i < 10; i++){
    console.log(`Iteration: ${i}`);
    galaxy.update();
    console.log(galaxy.toString() + "\n");
}
//!SECTION