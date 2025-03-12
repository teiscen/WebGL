const ExampleBoard = [
    [3, 0, 6, 5, 0, 8, 4, 0, 0],
    [5, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 7, 0, 0, 0, 0, 3, 1],
    [0, 0, 3, 0, 1, 0, 0, 8, 0],
    [9, 0, 0, 8, 6, 3, 0, 0, 5],
    [0, 5, 0, 0, 9, 0, 6, 0, 0],
    [1, 3, 0, 0, 0, 0, 2, 5, 0],
    [0, 0, 0, 0, 0, 0, 0, 7, 4],
    [0, 0, 5, 2, 0, 6, 3, 0, 0],
];

const SolvedBoard = [
    [3, 1, 6, 5, 7, 8, 4, 9, 2],
    [5, 2, 9, 1, 3, 4, 7, 6, 8],
    [4, 8, 7, 6, 2, 9, 5, 3, 1],
    [2, 6, 3, 4, 1, 5, 9, 8, 7],
    [9, 7, 4, 8, 6, 3, 1, 2, 5],
    [8, 5, 1, 7, 9, 2, 6, 4, 3],
    [1, 3, 8, 9, 4, 7, 2, 5, 6],
    [6, 9, 2, 3, 5, 1, 8, 7, 4],
    [7, 4, 5, 2, 8, 6, 3, 1, 9],
];


/*
Pseudo:
find next empty cell (0),
loop from 1 to 9
check that this is not used in the column
check that this is not used in the row
check that this is not used in the 3x3 square

if it doesnt work go back to previous cell and try again from the previous left at number.
*/
//SECTION - Solver
// Conditions
function uniqueInCol(board, key, { row, col }) {
    return !board.some((colArray) => colArray[col] === key);
}
function uniqueInRow(board, key, {row, col}){
    return !board[row].includes(key);
}
function uniqueInGrid(board, key, {row, col}){
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;
    
    const seen = new Set();
    
    for (let r = rowStart; r < rowStart + 3; r++) {
        for (let c = colStart; c < colStart + 3; c++) {
            if (board[r][c] === key) {
                return false;
            }
        }
    }
    return true;
}

function incrementCoord({row, col}){
    // console.log(`Incr: row: ${row}, col:${col}`);
    if(++col === 9){
        col = 0;
        row++;
    }
    // console.log(`Incr new: row: ${row}, col:${col}`);
    return {row: row, col: col};
}
function decrementCoord({row, col}){
    // console.log(`Decr: row: ${row}, col:${col}`);
    if(--col === -1){
        col = 8;
        row--;
    }
    // console.log(`Decr new: row: ${row}, col:${col}`);
    return {row: row, col: col};
}


async function solveBoard(board){
    const solvedBoard = board.map(row => [...row]);
    await rSolveBoard(board, solvedBoard, {row: 0, col: 0}, true);
    return solvedBoard;
}

async function rSolveBoard(board, solvedBoard, {row, col}, movingForward){
    /* ------------------------------- Debug Start ------------------------------ */
    // await waitForInput('Press any key to continue...\n');
    // await delay(100); // Delay before each iteration
    // console.clear();
    // console.log();
    // prettyPrintCoord(solvedBoard, {row, col});
    /* -------------------------------- Debug End ------------------------------- */

    //Base cases
    //success: past the end will mean row == 9
    //failure: before the start will mean row == 9
    if(row === 9 || row === -1){
        return true;
    }

    // Value is part of the original board
    // Skip forward or back depending on motion
    if(board[row][col] !== 0){
        let newCoord = movingForward ? incrementCoord({row, col}) : decrementCoord({row, col});
        return await rSolveBoard(board, solvedBoard, newCoord, movingForward)
    }
    
    // If we moved forward that changes everything and we need to restart at 0
    // If we moved back that means we need to start at the next value
    let startingValue = movingForward ? 1 : solvedBoard[row][col] + 1;

    for(key = startingValue; key < 10; key++){
        if( uniqueInCol(solvedBoard, key, {row, col}) && 
            uniqueInRow(solvedBoard, key, {row, col}) && 
            uniqueInGrid(solvedBoard, key, {row, col})){
                // The key was found valid by the restrictions
                solvedBoard[row][col] = key;
                if(await rSolveBoard(board, solvedBoard, incrementCoord({row, col}), true)){
                    return true;
                }
                solvedBoard[row][col] = 0;
            }
        }
    // No valid key could be found so we go backwards 
    // Have to reset the solvedBoard value so the previous can retry the combinations
    solvedBoard[row][col] = 0;  
    return await rSolveBoard(board, solvedBoard, decrementCoord({row, col}), false);
}

//!SECTION

//SECTION - Debugging 
function prettyPrint(board){
    board.forEach(colArray => {
        let str = "";
        colArray.forEach(value => {
            str += `  ${value}`;
        })
        console.log(str);
    });
}

function prettyPrintCoord(board, {row, col}){
    board.forEach((colArray, rI) => {
        let str = "";
        colArray.forEach((value, cI) => {
            (row == rI && col == cI) ?  str += `\x1b[35m ${value} \x1b[0m`
                                    :   str += ` ${value} `;
        })
        console.log(str);
    });
}

function verifySolution(board, solvedBoard){
    const difference = Array(9).fill(null).map(() => Array(9).fill('-'));

    let isSame = true;
    board.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if(board[rowIndex][colIndex] != solvedBoard[rowIndex][colIndex]){
                isSame = false;
                difference[rowIndex][colIndex] = board[rowIndex][colIndex];
            }
        })
    });

    console.log("Starting Board:");
    prettyPrint(board);
    console.log("Solved Board:");
    prettyPrint(solvedBoard);
    console.log("Differences:");
    (isSame) ?  console.log("They are the same.") 
            :   prettyPrint(difference);
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const readline = require('readline');

function waitForInput(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
//!SECTION

//SECTION - part thats being executed 
(async() => {
    const start = Date.now()
    const myBoard = await solveBoard(ExampleBoard);
    verifySolution(myBoard, SolvedBoard);
    prettyPrint(myBoard)
    console.log(`ALL Done in ${Date.now() - start}ms`)
})();
//!SECTION
