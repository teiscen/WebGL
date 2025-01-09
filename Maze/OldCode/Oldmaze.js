class Wall{
    active;
    constructor(){
        this.active = true;
    }
}

class Maze{


    constructor(width, height){
        this.horWalls = []
        this.verWalls = []

        this.horWalls = new Array(height - 1).fill().map(() => 
            new Array(width).fill().map(() => 
                new Wall())
        );
        this.verWalls = new Array(height).fill().map(() => 
            new Array(width - 1).fill().map(() => 
                new Wall())
        );
    }

    genMaze() {
        // Helper function to shuffle arrays
        const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    
        const width = this.verWalls[0].length + 1;
        const height = this.horWalls.length + 1;
    
        // Visited set to track which virtual cells are explored
        let visited = new Set();
    
        // Stack for DFS
        let stack = [];
    
        // Start at the top-left corner cell
        stack.push([0, 0]);
        visited.add(`0,0`);
    
        while (stack.length > 0) {
            // Current cell
            const [row, col] = stack.pop();
    
            // Determine neighboring cells
            let neighbors = [];
            if (row > 0 && !visited.has(`${row - 1},${col}`))
                neighbors.push([row - 1, col, 'up']);
            if (row < height - 1 && !visited.has(`${row + 1},${col}`))
                neighbors.push([row + 1, col, 'down']);
            if (col > 0 && !visited.has(`${row},${col - 1}`))
                neighbors.push([row, col - 1, 'left']);
            if (col < width - 1 && !visited.has(`${row},${col + 1}`))
                neighbors.push([row, col + 1, 'right']);
    
            if (neighbors.length > 0) {
                // Push current cell back to revisit later
                stack.push([row, col]);
    
                // Choose a random neighbor
                const [nextRow, nextCol, direction] = shuffle(neighbors)[0];
    
                // Remove the wall between current and next cell
                if (direction === 'up') this.horWalls[row - 1][col].active = false;
                if (direction === 'down') this.horWalls[row][col].active = false;
                if (direction === 'left') this.verWalls[row][col - 1].active = false;
                if (direction === 'right') this.verWalls[row][col].active = false;
    
                // Mark the neighbor as visited and push onto stack
                visited.add(`${nextRow},${nextCol}`);
                stack.push([nextRow, nextCol]);
            }
        }
    }

    printWalls(){
        const wallStatusV = (wall) => wall.active ? "|" : " ";
        const wallStatusH = (wall) => wall.active ? "--" : "  ";

        let horWallStr = [];
        let wallStr = [];

        this.horWalls.forEach((horWallRow) => {
            let str = "";
            horWallRow.forEach((wall) => {
                str += ` ${wallStatusH(wall)}  `;
            });
            horWallStr.push(`${str}`);
        });

        this.verWalls.forEach((verWallRow, rowIndex) => {
            let str = "";
            verWallRow.forEach((wall, colIndex) => {
                str += ` ${colIndex}${rowIndex} ${wallStatusV(wall)}`;
            });

            wallStr.push(str + ` ${verWallRow.length}${rowIndex}`);
            wallStr.push(horWallStr.shift()); 
        });
        console.log(wallStr);
    }
}

// Width height
let maze = new Maze(8, 10);
maze.printWalls();
maze.genMaze();
maze.printWalls();