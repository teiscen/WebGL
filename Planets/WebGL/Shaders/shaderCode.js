import { initShaderProgram } from "./shader.js"

const vsSource = `#version 300 es
    // #pragma vscode_glsllint_stage: vert
    precision highp float;

    layout(location=0)in vec3     vPosition;
    layout(location=1)in vec4     vColor;

    layout(location=2)in float    tScale;
    layout(location=3)in vec3    tPosition;
    layout(location=4)in vec4     tColor;

    // uniform float uScale;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    out vec4 fragColor;

    void main(){
        // float nScale = uScale / 2.0;
        // vec2  nOffset = tOffset * 2.0;
        
        mat4 scaleMatrix = mat4(
            tScale,     0.0,    0.0, 0.0,
            0.0,        tScale, 0.0, 0.0,
            0.0,        0.0,    1.0, 0.0,
            tScale,     tScale, 0.0, 1.0
        );

        // mat4 rotationMatrix = mat4(
        //     cos(tRotation), -sin(tRotation), 0.0, 0.0,
        //     -sin(tRotation),-cos(tRotation), 0.0, 0.0,
        //     0.0,            0.0,             1.0, 0.0,
        //     0.0,            0.0,             0.0, 1.0
        // );

        // x y posn are swapped i think
        mat4 translationMatrix = mat4(
            1.0,            0.0,            0.0, 0.0,
            0.0,            1.0,            0.0, 0.0,
            0.0,            0.0,            1.0, 0.0,
            tPosition.x,    tPosition.y,    0.0, 1.0
        );

        mat4 modelMatrix =  scaleMatrix * translationMatrix;// * rotationMatrix;
        mat4 cameraMatrix = uProjectionMatrix * uModelViewMatrix;

        gl_Position =  cameraMatrix * modelMatrix * vec4(vPosition, 1.0);
        fragColor = vColor * tColor;
    }
`;


const fsSource = `#version 300 es
    // #pragma vscode_glsllint_stage: frag
    precision highp float;

    in vec4 fragColor;
    out vec4 FragColor;

    void main(){
        FragColor = fragColor;
    }
`;

function shaderProgram(gl){
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    return {
        program: shaderProgram,
        attribLocations: {
            vPosition:          gl.getAttribLocation(shaderProgram, "vPosition"),
            vColor:             gl.getAttribLocation(shaderProgram, "vColor"),
            tOffset:            gl.getAttribLocation(shaderProgram, "tScale"),
            tRotation:          gl.getAttribLocation(shaderProgram, "tPosition"),
            tColor:             gl.getAttribLocation(shaderProgram, "tColor"),
        },
        uniformLocations: {
            // uScale:             gl.getUniformLocation(shaderProgram, "uScale"),
            uModelViewMatrix:   gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            uProjectionMatrix:  gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        }
    }
}

export {shaderProgram}

