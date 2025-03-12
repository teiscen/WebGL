const NORTH = 0b1000;
const EAST  = 0b0100;
const SOUTH = 0b0010;
const WEST  = 0b0001;


// The coordinate system is based on the top left corner being 0,0
// moving EAST incrementing row(x)
// moving SOUTH incrementing col(y)
class Cell{
    constructor({row, col}){
        this.coordinate = {row: row, col: col};
        this.walls      = 0b1111;
    }

    // Removes this cell's wall as well as the other
    removeWall(cardinalDirection){
        this.walls &= ~cardinalDirection;
    }

    // Returns x, y does not confirm truthfulness
    getNeighbourCoord(cardinalDirection){
        let y = this.coordinate.row;
        let x = this.coordinate.col;
        switch (cardinalDirection){
            case NORTH:
                return {row: --y, col: x};
            case EAST:
                return {row: y,   col: ++x};
            case SOUTH:
                return {row: ++y, col: x};    
            case WEST:
                return {row: y,   col: --x};
        }
    }

    // Print individual cell's walls and coordinates side by side
    formatCell() {
        let top = "";
        let mid = "";
        let bottom = "";

        this.walls & NORTH ? top += "  --  " : top += "      ";

        this.walls & WEST ? mid += "|" : mid += " ";
        mid += ` ${this.coordinate.row}${this.coordinate.col} `;
        this.walls & EAST ? mid += "|" : mid += " ";

        this.walls & SOUTH ? bottom += "  --  " : bottom += '      ';

        return { top, mid, bottom };
    }
}

class CellArray{

    cellArray;
    endCell;

    constructor({x, y}){
        this.endCell = {x: x, y: y};

        this.cellArray = new Array(y).fill().map(() => {
            return new Array(x).fill(null);
        });

    
        this.cellArray.forEach((value, yIndex) => {
            value.forEach((value, xIndex) => {
                this.addCell({row: yIndex, col: xIndex});
            });
        });
    }

    addCell({row, col}){
        this.cellArray[row][col] = new Cell({row, col});
    }

    getCell({row, col}){
        // console.log(this.cellArray[row][col]);
        return this.cellArray[row][col];
    }

    removeWall({row, col}, direction){
        this.cellArray[row][col].removeWall(direction);
        let {row: nRow, col: nCol} = this.cellArray[row][col].getNeighbourCoord(direction);
        switch(direction){
            case NORTH:
                this.cellArray[nRow][nCol].removeWall(SOUTH);
                break;
            case EAST:
                this.cellArray[nRow][nCol].removeWall(WEST);
                break;
            case SOUTH:
                this.cellArray[nRow][nCol].removeWall(NORTH);
                break;
            case WEST:
                this.cellArray[nRow][nCol].removeWall(EAST);
                break;
        }
    }

    print() {
        // Top, middle, and bottom rows
        let topRow = '', midRow = '', bottomRow = '';
        
        // Go through the 2D array of cells
        this.cellArray.forEach(row => {
            row.forEach(cell => {
                // Print each cell's wall pieces and coordinates in place
                const { top, mid, bottom } = cell.formatCell();
                topRow += top;
                midRow += mid;
                bottomRow += bottom;
            });
            // After completing a row, print the collected strings for top, mid, and bottom
            console.log(topRow);
            console.log(midRow);
            console.log(bottomRow);
            // Reset row accumulators for next iteration
            topRow = midRow = bottomRow = '';
        });
    }

}

class MazeGeneratorFactory{
    /**
     * @param {number} height 
     * @param {number} width 
     * @returns {Array} 2D Array of Cell
     */
    dfsFactory(height, width){
        let mazeArray = new CellArray({x: width, y: height});
        let cardinalDirections = [NORTH, EAST, SOUTH, WEST];

        let stack = [];
        stack.push({row: 0, col: 0});

        let visited = new Array(height).fill().map(() => {
            return new Array(width).fill(false);
        });

        while(stack.length > 0){
            let {row: cRow, col: cCol} = stack.pop();

            let neighbors = []; // Cardinal Direction
            cardinalDirections.forEach((direction) => {
                let {row: nRow, col: nCol} = mazeArray.getCell({row: cRow, col: cCol})
                                .getNeighbourCoord(direction);
                
                if (nRow >= 0 && nRow < height &&
                    nCol >= 0 && nCol < width &&
                    !visited[nRow][nCol]) {
                        neighbors.push(direction);
                }
            });

            if(neighbors.length > 0){
                stack.push({row: cRow, col: cCol});
                let direction = neighbors[Math.floor(Math.random() * neighbors.length)];
                let {row: nRow, col: nCol} = mazeArray.getCell({row: cRow, col: cCol})
                    .getNeighbourCoord(direction);
                visited[nRow][nCol] = true;
                stack.push({row: nRow, col: nCol});
                mazeArray.removeWall({row: cRow, col: cCol}, direction);
            }
        }

        return mazeArray;
    }

    primFactory(height, width){

    }

    kruskalFactory(height, width){

    }
}

// let mazeGen = new MazeGeneratorFactory();

// let maze1 = mazeGen.dfsFactory(5, 6);
// console.log("Maze1: row:5, col:6");
// maze1.print();

// let maze2 = mazeGen.dfsFactory(3, 9)
// console.log("Maze2: row:3, col:9");
// maze2.print();

// let maze3 = mazeGen.dfsFactory(9, 9);
// console.log("Maze3: row:9, col:9");
// maze3.print();

export { MazeGeneratorFactory }