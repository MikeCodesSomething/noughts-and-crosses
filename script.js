//Object Structure:
//Player > User and Opponent 2 objects sharing player prototype
//Board - Create this as a module
//Piece > Nought and Cross 2 objects sharing piece prototype
//Game > Turn?

const gameBoard = (() => {
    const numberOfRows = 3;
    const numberOfColumns = 3;

    const generateBoard = (rows,cols) => {
        const board = [];
        for(let i = 0; i < rows; i++) {
            for(let j =0; j < cols; j++) {
                board.push({row: i, column: j, state:null})
            }
        }
        return board;
    }
    // [{row: 0, column:0, state: null}, {row: 0, column:1, state: null}, {row: 0, column:2, state: null},
    //  {row: 1, column:0, state: null}, {row: 1, column:1, state: null}, {row: 1, column:2, state: null},
    //  {row: 2, column:0, state: null}, {row: 2, column:1, state: null}, {row: 2, column:2, state: null}];

    const getNumberOfRows = () => numberOfRows;
    const getNumberOfColumns = () => numberOfColumns;

    const getBoardCell = (row, column) => {
        for (let cell of board) {
            if(cell.row === row && cell.column === column) return cell;
        }
        return false;
    }

    const updateBoardCell = (cell, newState) => {
        cell.state = newState;
    }

    const getBoard = () => board;

    const printBoard = () => {
        let boardString = ''
        board.forEach((cell, index) => {
            if(index === board.length-1) boardString += `${cell.state||' '}`
            else if(index % numberOfColumns === numberOfColumns-1) {
                return boardString += `${cell.state||' '}\n${"-".repeat(2*numberOfColumns -1)}\n`;
            }
            else boardString += `${cell.state||' '}|`
            });
        console.log(boardString);         
        };
    
    //Initialise
    let board = generateBoard(numberOfRows,numberOfColumns);
    printBoard();


    //return public methods
    return {getNumberOfRows, getNumberOfColumns, getBoard, getBoardCell, printBoard, updateBoardCell};
})();

const gameController = (() => {
    let players = [];

    const createPlayer = (name) => {
        let piece = 'X';
        if(players.length === 0) piece = 'O';
        if(players.length > 1) return;
        return {name, piece}
    }

    const updatePlayerName = (index, newName) => {
        players[index].name = newName;
    }

    const placePiece = (row, column) => {
        //update gameboard if an empty space has been picked
        let cell = gameBoard.getBoardCell(row, column);
        if(cell.state === null) {
            gameBoard.updateBoardCell(cell, activePlayer.piece)
            //switch players turn if game isn't over
            gameOverStatus = gameOverCheck()
            if(gameOverStatus === false) {
            activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];
            }
            //if game is over log the result
            if(gameOverStatus === 'draw') console.log("Game over, it's a draw!")
            else if(gameOverStatus !== false) console.log(`Game over! ${gameOverStatus}'s win`);
        }
        else console.log("Can't choose that cell, try again")
    }
    
    const gameOverCheck = () => {
        let board = gameBoard.getBoard();
        let numberOfRows = gameBoard.getNumberOfRows();
        let numberOfColumns = gameBoard.getNumberOfColumns();

        //Check if there is a full row of the same state (not blank)
        for(i = 0; i < numberOfRows; i++) {
            let rowFirstIndex = numberOfRows * i;
            let row = [];
            // Get the full row
            for(j = 0; j < numberOfColumns; j++) {
                row.push(board[rowFirstIndex + j].state)
            }
            console.log(row);
            let rowAllSameState = row.every((state) => state === row[0])
            if(row[0]!= null && rowAllSameState) return row[0];
            }

        //Check if there is a full column of the same state (not blank)
        for(i = 0; i < numberOfColumns; i++) {
            let columnFirstIndex = i;
            let column = [];
            // Get the full row
            for(j = 0; j < numberOfRows; j++) {
                column.push(board[columnFirstIndex + j * numberOfColumns].state)
            }
            let colAllSameState = column.every((state) => state === column[0]);
            if(column[0] != null && colAllSameState) return column[0];
            }
        
        //We only need to check diagonals if cols = rows
        if(numberOfColumns === numberOfRows) {
            //Check if there is a full diagonal of the same state (not blank)

            let downDiagonal = [];
            //(0,0) (1,1) (2,2)... starting at 0, (add number of columns + 1)
            for(i = 0;
                i < board.length;
                i += 1+numberOfColumns){
                    downDiagonal.push(board[i].state);
                } 
            let downDiagAllSameState = downDiagonal.every((state) => state === downDiagonal[0]);
            if(downDiagonal[0] != null && downDiagAllSameState) return downDiagonal[0];



            //(0,2) (1,1) (2,0)... starting at end of first row, add (number of columns -1)
            let upDiagonal = [];
            for(i = numberOfColumns-1;
                i < board.length - 1;
                i += numberOfColumns-1){
                    upDiagonal.push(board[i].state);
                } 
            let upDiagAllSameState = upDiagonal.every((state) => state === upDiagonal[0]);
            if(upDiagonal[0] != null && upDiagAllSameState) return upDiagonal[0];
        }
        
        //If no one has won, check to see if all spaces have been filled.
        let allSpacesFilled = board.every(cell => cell.state !== null);
        if(allSpacesFilled) return 'draw'     

        // for diagonal, check if there is 3 in a row with
        return false;
    }

    //Initialise
    
    players.push(createPlayer('PLAYER 1'));
    players.push(createPlayer('PLAYER 2'));
    let activePlayer = players[0];
    console.log(players);


    return {placePiece, updatePlayerName}




})();







const displayController = (() => {

    //Cache DOM elements:
    const gameBoardContainer = document.getElementById("grid-container");
    //Render the game board
    const render = () => {
        let board = gameBoard.getBoard();
        let numberOfRows = gameBoard.getNumberOfRows();
        let numberOfColumns = gameBoard.getNumberOfColumns();
        
        for (let i = 0; i < numberOfRows; i++) {
            let boardRow = document.createElement('div');
            boardRow.classList.add('board-row')
            for (let j = 0; j < numberOfColumns; j++) {
                let cellIndex = i*numberOfColumns + j
                let cellDiv = createCell(board[cellIndex]);             
                boardRow.appendChild(cellDiv);
            }
           gameBoardContainer.appendChild(boardRow);
        }
    }         

    const createCell = (cell) => {
        let cellDiv = document.createElement('div');
        cellDiv.classList.add('game-board-cell');
        cellDiv.setAttribute('id',`${cell.row}-${cell.column}`)
        return cellDiv
        // console.log(`${cell.row}-${cell.column}`)
    }

    //Initialise
    render();

})();