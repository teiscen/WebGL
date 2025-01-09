const vsSource = `#version 300 es
	precision mediump float;

	// Input attributes
	in vec3 	position;    		// Vertex position
	in vec4 	color;       		// Vertex color
	in vec2 	transPosn; 			// Transformation position (offset)
	in float 	rotation;  			// Rotation angle (radians)
	in vec4 	transColor; 		// Color to apply for transformation


	// Output to fragment shader
	out vec4 fragColor;

	// Uniforms
	uniform float scale;
	uniform mat4 modelViewMatrix;  // View and model matrix (combined)
	uniform mat4 projectionMatrix; // Projection matrix

	void main() {
		mat4 rotationMatrix = mat4(
			cos(rotation), -sin(rotation), 0.0, 0.0,
			sin(rotation),  cos(rotation), 0.0, 0.0,
			0.0,            0.0,           1.0, 0.0,
			0.0,            0.0,           0.0, 1.0
		);

		mat4 scaleMatrix = mat4(
			scale,  0.0, 	0.0, 0.0,
			0.0,  	scale,  0.0, 0.0,
			0.0,   	0.0,    1.0, 0.0,
			0.0,    0.0,    0.0, 1.0
		);

		mat4 translationMatrix = mat4(
			1.0, 0.0, 0.0, transPosn.x,
			0.0, 1.0, 0.0, transPosn.y,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0			
		);

		mat4 transformationMatrix = scaleMatrix * rotationMatrix * translationMatrix;

		//LAST CHANGES   
    	vec4 newPosn = transformationMatrix * vec4(position, 1.0);
		vec4 viewPos = modelViewMatrix * newPosn;
		gl_Position = projectionMatrix * viewPos;

		fragColor = vec4(color * transColor);
	}
`;

const fsSource = `#version 300 es
	precision mediump float;

	in vec4 fragColor;
	out vec4 FragColor;

	void main() {
    	FragColor = fragColor;
	}

`;

function mazeShaderProgram(gl){
	const shaderProgram =  initShaderProgram(gl, vsSource, fsSource);

	return{
		program: shaderProgram,
		attribLocations: {
			position: gl.getAttribLocation(shaderProgram, "position"),
			color: gl.getAttribLocation(shaderProgram, "color"),
			transPosn: gl.getAttribLocation(shaderProgram, "transPosn"),
			rotation: gl.getAttribLocation(shaderProgram, "rotation"),
			transColor: gl.getAttribLocation(shaderProgram, "transColor"),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, "projectionMatrix"),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, "modelViewMatrix"),
			scale: gl.getUniformLocation(shaderProgram, "scale")
		},
	};
}

// Should be moved to a different folder as its standard
/**
 * Takes in shaders, then returns the shader program. Doesnt "enable it" for GPU usage.
 * @param {*} gl 
 * @param {*} vsSource 
 * @param {*} fsSource 
 * @returns shaderProgram 
 */
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

export { mazeShaderProgram };