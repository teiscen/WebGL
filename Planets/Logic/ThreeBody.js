import { Galaxy } from "./Galaxy.js"
import { CelestialBody } from "./Planet.js"
import { vec3 } from "../../node_modules/gl-matrix/esm/index.js"

// Convert [x, y] arrays to vec3
function toVec3s(list, scale) {
    return list.map(([x, y]) => {
        const v = vec3.fromValues(x, y, 0);
        vec3.scale(v, v, scale); // multiply each vec3 by 100
        return v;
    });
}

function toVec3(list) {
    return list.map(([x, y]) => {
        const v = vec3.fromValues(x, y, 0);
        return v;
    });
}

function generateGalaxy(positionList, velocityList){
    let mass = 1; 
    let radius = 10;
    let velV3L = toVec3s(velocityList,  0.5);
    let posnV3L = toVec3s(positionList, 20);
    let colors = [
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
    ];

    let b0 = new CelestialBody("b0", velV3L[0], mass, colors[0], radius, posnV3L[0]);
    let b1 = new CelestialBody("b1", velV3L[1], mass, colors[1], radius, posnV3L[1]);
    let b2 = new CelestialBody("b2", velV3L[2], mass, colors[2], radius, posnV3L[2]);
    let gal = new Galaxy("Gal", 1, 1);
    gal.addCelestialBody(b0); gal.addCelestialBody(b1); gal.addCelestialBody(b2); 
    return gal; 
}

const ThreeBodyInitials = new Map([
    ["Figure 8", {
        positions: [
            [0.97000436, -0.24308753],
            [-0.97000436, 0.24308753],
            [0, 0]
        ],
        velocities: [
            [0.466203685, 0.43236573],
            [0.466203685, 0.43236573],
            [0.93240737, 0.86473146]
        ]
    }],
    ["Broucke-Henon", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.347111, 0.0],
            [-0.173555, 0.300355],
            [-0.173555, -0.300355]
        ]
    }],
    ["Ying-Yang 1", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.379572, 0.0],
            [-0.189786, 0.308883],
            [-0.189786, -0.308883]
        ]
    }],
    ["Ying-Yang 2", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.386044, 0.0],
            [-0.193022, 0.314073],
            [-0.193022, -0.314073]
        ]
    }],
    ["Gerschgorin", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.370248, 0.0],
            [-0.185124, 0.301049],
            [-0.185124, -0.301049]
        ]
    }],
    ["Moth 1", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.393017, 0.0],
            [-0.196509, 0.317924],
            [-0.196509, -0.317924]
        ]
    }],
    ["Moth 2", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.399489, 0.0],
            [-0.199744, 0.323114],
            [-0.199744, -0.323114]
        ]
    }],
    ["Dragonfly", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.406687, 0.0],
            [-0.203343, 0.329088],
            [-0.203343, -0.329088]
        ]
    }],
    ["Butterfly 1", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.401269, 0.0],
            [-0.200635, 0.326893],
            [-0.200635, -0.326893]
        ]
    }],
    ["Butterfly 2", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.410127, 0.0],
            [-0.205064, 0.333892],
            [-0.205064, -0.333892]
        ]
    }],
    ["Butterfly 3", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.417013, 0.0],
            [-0.208507, 0.338013],
            [-0.208507, -0.338013]
        ]
    }],
    ["Butterfly 4", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.423485, 0.0],
            [-0.211743, 0.343203],
            [-0.211743, -0.343203]
        ]
    }],
    ["Butterfly 5", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.429957, 0.0],
            [-0.214979, 0.348393],
            [-0.214979, -0.348393]
        ]
    }],
    ["Butterfly 6", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.436429, 0.0],
            [-0.218215, 0.353583],
            [-0.218215, -0.353583]
        ]
    }],
    ["Butterfly 7", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.442901, 0.0],
            [-0.221451, 0.358773],
            [-0.221451, -0.358773]
        ]
    }],
    ["Butterfly 8", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.449373, 0.0],
            [-0.224687, 0.363963],
            [-0.224687, -0.363963]
        ]
    }],
    ["Butterfly 9", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.455845, 0.0],
            [-0.227923, 0.369153],
            [-0.227923, -0.369153]
        ]
    }],
    ["Butterfly 10", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.462317, 0.0],
            [-0.231159, 0.374343],
            [-0.231159, -0.374343]
        ]
    }],
    ["Butterfly 11", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.468789, 0.0],
            [-0.234395, 0.379533],
            [-0.234395, -0.379533]
        ]
    }],
    ["Butterfly 12", {
        positions: [
            [0.0, 1.0],
            [-0.5, -0.5],
            [0.5, -0.5]
        ],
        velocities: [
            [0.475261, 0.0],
            [-0.237631, 0.384723],
            [-0.237631, -0.384723]
        ]
    }],
]);

export { ThreeBodyInitials, generateGalaxy }