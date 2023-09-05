//Object Structure:
//Player > User and Opponent 2 objects sharing player prototype
//Board - Create this as a module
//Piece > Nought and Cross 2 objects sharing piece prototype
//Game > Turn?

const gameBoard = (() => {
    const board = [
        {row: 0, column:0, state: null}, {row: 0, column:1, state: null}, {row: 0, column:2, state: null},
        {row: 1, column:0, state: null}, {row: 1, column:1, state: null}, {row: 1, column:2, state: null},
        {row: 2, column:0, state: null}, {row: 2, column:1, state: null}, {row: 2, column:2, state: null}
    ];

    const updateBoardCell = (row, column, newState) => {
        for (let cell of board) {
            if(cell.row === row && cell.column === column) cell.state = newState;
        }
    }

    const getboard = () => board;

    const printboard = () => {
        let boardString = ''
        board.forEach((cell, index) => {
            if(index === 8) boardString += `${cell.state||' '}`
            else if(index % 3 === 2) boardString += `${cell.state||' '}\n-----\n`;
            else boardString += `${cell.state||' '}|`
            });
        console.log(boardString);         
        };
    
    printboard();


    //return public methods
    return {getboard, printboard, updateBoardCell};
})();

const displayController = (() => {

    //Cache DOM elements:
    const gameBoardContainer = document.getElementById("grid-container");
''    //Render the game board
    const render = () => {
        board = gameBoard.getboard();
        board.forEach(cell => displayCell(cell));
        console.log('ran render')
    }         

    const displayCell = (cell) => {
        let cellDiv = document.createElement('div');
        cellDiv.classList.add('game-board-cell');
        cellDiv.setAttribute('id',`${cell.row}-${cell.column}`)
        gameBoardContainer.appendChild(cellDiv);
        // console.log(`${cell.row}-${cell.column}`)
    }

    //Initialise
    render();

})();