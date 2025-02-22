class Vec3{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString(){
        const f = (num) => num.toFixed(1);
        return `${f(this.x)}, ${f(this.y)}, ${f(this.z)}`;
    }
}

// Implementation is adapted from: https://www.youtube.com/watch?v=7axImc1sxa0&t=646s
class CelestialBody {
    constructor(name, mass, radius, initialVel, initialPosn){
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.vel = initialVel;
        this.posn = initialPosn;
    }

    updateVelocity(cBody, gravConst, timeStep){
        // let sqrDst = (cBody.posn - this.posn).sqrMagnitude // Float
        // let forceDir = (cBody.posn = this.posn).normalized // vec3
        // let force = forceDir * gravConst * cBody.mass * this.mass / sqrDist; //vec3
        // let acceleration = force / this.mass; // vec3 this.mass cancels out but might be useful later
        this.vel += acceleration * timeStep;
    }

    updatePosition(timeStep){
        // this.posn += this.vel * timeStep;
    }

    toString(){
        const padSizeStart = 9, padSizeEnd = 20; 
        const nameLabel     = 'Name:'.padEnd(padSizeStart);
        const massLabel     = 'Mass:'.padEnd(padSizeStart);
        const radiusLabel   = 'Radius:'.padEnd(padSizeStart);
        const velocityLabel = 'Vel:'.padEnd(padSizeStart);
        const positionLabel = 'Posn:'.padEnd(padSizeStart);

        const nameValue     = this.name.padEnd(padSizeEnd);
        const massValue     = this.mass.toString().padEnd(padSizeEnd);
        const radiusValue   = this.radius.toString().padEnd(padSizeEnd);
        const velocityValue = this.vel.toString().padEnd(padSizeEnd);
        const positionValue = this.posn.toString().padEnd(padSizeEnd);

        return `${nameLabel}${nameValue}\n${massLabel}${massValue}\n${radiusLabel}${radiusValue}\n${velocityLabel}${velocityValue}\n${positionLabel}${positionValue}`;
    }

    //NOTE - Takes in string, in the format of toString(), can chain multiple
    static compareCelestialBodies(body1Str, body2Str){
        let body1Parts = body1Str.split("\n");
        let body2Parts = body2Str.split("\n");
        let str = ""; 

        body1Parts.forEach((line, index) => {
            str += line + " | " + body2Parts[index];
            if (index < body1Parts.length - 1) { str += "\n"; } // Causes undefined error when merging multiple together otherwise
        });

        return str;
    }
}

// const sun   = new CelestialBody("Sun", 10, 3, new Vector3(0.0, 0.0, 0.0), new Vector3(0.0, 0.0, 0.0));
// const earth = new CelestialBody("Earth", 1, 1, new Vector3(1.0, 1.0, 0.0), new Vector3(10.0, 10.0, 0.0));
// console.log(result);

export { CelestialBody, Vec3 }