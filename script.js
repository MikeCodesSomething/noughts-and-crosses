//Object Structure:
//Player > User and Opponent 2 objects sharing player prototype
//Board - Create this as a module
//Piece > Nought and Cross 2 objects sharing piece prototype
//Game > Turn?

const gameBoard = (() => {
    const numberOfRows = 3;
    const numberOfColumns = 3;

    const generateBoard = (rows,cols) => {
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

    const resetBoard = () => {
        if(board.length > 0) board = [];
    }

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
    let board = []
    board = generateBoard(numberOfRows,numberOfColumns);
    printBoard();


    //return public methods
    return {generateBoard, getNumberOfRows, getNumberOfColumns, getBoard, resetBoard, getBoardCell, printBoard, updateBoardCell};
})();

const gameController = (() => {
    let players = [];
    let gameLog = [];

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
        //update gameboard if empty space picked and it's not game over
        let cell = gameBoard.getBoardCell(row, column);
        if(cell.state === null && gameOverCheck() === false) {
            gameBoard.updateBoardCell(cell, activePlayer.piece)
            //switch players turn if game isn't over
            gameOverStatus = gameOverCheck()
            if(gameOverStatus === false) {
            activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];
            }
            //if game is over log the result
            if(gameOverStatus === 'draw') updateGameLog("Game over, it's a draw!")
            else if(gameOverStatus !== false) updateGameLog(`Game over! ${gameOverStatus} wins`);
        }
        // else updateGameLog("Can't choose that cell, try again")
    }
    
    const gameOverCheck = () => {
        let board = gameBoard.getBoard();
        let numberOfRows = gameBoard.getNumberOfRows();
        let numberOfColumns = gameBoard.getNumberOfColumns();

        //Check if there is a full row of the same state (not blank)
        for(i = 0; i < numberOfRows; i++) {
            let rowFirstIndex = numberOfColumns * i;
            let row = [];
            // Get the full row
            for(j = 0; j < numberOfColumns; j++) {
                row.push(board[rowFirstIndex + j].state)
            }

            let rowAllSameState = row.every((state) => state === row[0])
            if(row[0]!= null && rowAllSameState) return activePlayer.name;
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
            if(column[0] != null && colAllSameState) return activePlayer.name;
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
            if(downDiagonal[0] != null && downDiagAllSameState) return activePlayer.name;

            //(0,2) (1,1) (2,0)... starting at end of first row, add (number of columns -1)
            let upDiagonal = [];
            for(i = numberOfColumns-1;
                i < board.length - 1;
                i += numberOfColumns-1){
                    upDiagonal.push(board[i].state);
                } 
            let upDiagAllSameState = upDiagonal.every((state) => state === upDiagonal[0]);
            if(upDiagonal[0] != null && upDiagAllSameState) return activePlayer.name;
        }
        
        //If no one has won, check to see if all spaces have been filled.
        let allSpacesFilled = board.every(cell => cell.state !== null);
        if(allSpacesFilled) return 'draw'     

        // for diagonal, check if there is 3 in a row with
        return false;
    }


    const updateGameLog = (logEntry) => {
        gameController.gameLog.unshift(logEntry);
    }

    const resetGameLog = () => {
       gameController.gameLog = [];
    }

    const getActivePlayer = () => {
        console.log(players);
        return activePlayer;    
    }

    //Initialise
    const startGame = () => {
    gameBoard.resetBoard();
    gameBoard.generateBoard(gameBoard.getNumberOfRows(),gameBoard.getNumberOfColumns());
    players = [];
    players.push(createPlayer('PLAYER 1'));
    players.push(createPlayer('PLAYER 2'));
    activePlayer = players[0];
    }
    let activePlayer;
    startGame();


    return {startGame, placePiece, updatePlayerName, gameLog, resetGameLog, getActivePlayer};




})();







const displayController = (() => {

    
    //Render the game board
    const render = () => {
        let board = gameBoard.getBoard();
        let numberOfRows = gameBoard.getNumberOfRows();
        let numberOfColumns = gameBoard.getNumberOfColumns();
        
        //Clear the existing board if it exists
        gameBoardContainer.replaceChildren();

        //Create as many cells as there are rows*columns, stored in rows
        for (let i = 0; i < numberOfRows; i++) {
            let boardRow = document.createElement('div');
            boardRow.classList.add('board-row')
            let cellHeight = gameBoardContainer.offsetHeight / numberOfRows -2;
            let cellWidth = gameBoardContainer.offsetHeight / numberOfColumns -2;
            for (let j = 0; j < numberOfColumns; j++) {
                let cellIndex = i*numberOfColumns + j
                let cellDiv = createCell(board[cellIndex]); 
                cellDiv.textContent = (board[cellIndex].state);

                //Trick to set line-height dynamically to center text in div
                cellDiv.style.lineHeight = `${cellHeight}px`;

                //Trick to size the O's and X's to be as big as will fit
                cellDiv.style.fontSize = `${Math.min(cellHeight, cellWidth)-10}px`;
                
                boardRow.appendChild(cellDiv);
            }
           gameBoardContainer.appendChild(boardRow);
        }
        renderGameLog();
        renderTurnDisplay(); 
    } 
    
    const renderGameLog = () => {
        gameLogDisplay.replaceChildren();
        for(logEntry of gameController.gameLog) {
            logEntryDiv = document.createElement('div');
            logEntryDiv.classList.add('log-entry');
            logEntryDiv.textContent = logEntry;
            gameLogDisplay.appendChild(logEntryDiv);
        }
    }

    const renderTurnDisplay = () => {
        let activePlayerName = gameController.getActivePlayer().name;
        let activePlayerPiece = gameController.getActivePlayer().piece;
        turnDisplay.textContent = `${activePlayerName}'s turn - placing ${activePlayerPiece}`;
    }

    const createCell = (cell) => {
        let cellDiv = document.createElement('div');
        cellDiv.classList.add('game-board-cell');
        cellDiv.setAttribute('data-row',cell.row);
        cellDiv.setAttribute('data-column',cell.column);
        return cellDiv
    }

    const playerNameChange = (event) => {
        let newName = event.target.value;
        if(event.target.id === 'player-1-name') gameController.updatePlayerName(0, newName);
        if(event.target.id === 'player-2-name') gameController.updatePlayerName(1, newName);
        render();
    }

    const playerClick = (event) => {
        //Get the coordinates of the cell clicked
        let row = event.target.dataset.row;
        let column = event.target.dataset.column;
        
        //Convert these string values to integers for calling the API
        row = parseInt(row);
        column = parseInt(column);
        
        //Call the placePiece api for that cell
        gameController.placePiece(row, column)
        
        //Re-render the board
        render();
    }

    const restartButtonClick = () => {
        gameController.startGame();
        gameController.resetGameLog();
        playerNameFields.reset();
        render();
    }

    //Initialise
    //Cache DOM elements:
    const gameBoardContainer = document.getElementById("grid-container");
    gameBoardContainer.addEventListener('click', playerClick);

    const playerNameFields = document.getElementById("player-name-form");
    const player1NameInput = document.getElementById("player-1-name");
    player1NameInput.addEventListener('input', playerNameChange);
    const player2NameInput = document.getElementById("player-2-name");
    player2NameInput.addEventListener('input', playerNameChange)

    const gameLogDisplay = document.getElementById("log-container");
    const turnDisplay = document.getElementById("turn-display");

    const restartButton = document.getElementById("restart-button");
    restartButton.addEventListener('click', restartButtonClick);

    //Render the board
    render();

    return {render};

})();