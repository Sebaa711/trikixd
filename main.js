const tictactoe = (function(doc) {

    const human = "X";
    const cpu = "O";
    let gameOver = false;

    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];


    const allCells = doc.querySelectorAll(".cell");

    allCells.forEach((cell) => {
        cell.addEventListener("click", (e) => {
            const targetRow = e.target.getAttribute("data-row");
            const targetColumn = e.target.getAttribute("data-column");
            if( board[targetRow][targetColumn] === human || 
                board[targetRow][targetColumn] === cpu || 
                gameOver || !e.target.classList.contains("available")) return;
            e.target.classList.remove("available");
            board[targetRow][targetColumn] = human;
            e.target.innerText = human;

            if(checkVictory(board, human)) {
                gameOver = true;
                alert("You win!!!")
                return;
            }
            
            if (checkTie(board)) {
                alert("It was a tie...")
                return;
            }

            else handleCpuMove();

        })
    })

    

    const handleCpuMove = function() {
        const {row, column} = (miniMax(board, cpu));
        board[row][column] = cpu;
        doc.querySelector(`.cell[data-row="${row}"][data-column="${column}"]`).innerText = cpu;
        if(checkVictory(board, cpu)) {
            gameOver = true;
            alert("You lose!!!")
            return;
        }
        
        if (checkTie(board)) {
            alert("It was a tie...")
            return;
        }
    }

    const checkVictory = function ( board, player) {
        if (board.some((row) => row.every((cell) => cell === player))) return true;
        if (board.every((row) => row[0] === player)) return true;
        if (board.every((row) => row[1] === player)) return true;
        if (board.every((row) => row[2] === player)) return true;

        if (board[0][0] === player && 
            board[1][1] === player && 
            board[2][2] === player ||
            board[0][2] === player &&
            board[1][1] === player &&
            board[2][0] === player) return true;

        return false;
    }

    const miniMax = function(myBoard, player) {
        const availableMoves = findMoves(myBoard);
      
        if (checkVictory(myBoard, cpu)) {
          return { score: 10 };
        } else if (checkVictory(myBoard, human)) {
          return { score: -10 };
        } else if (availableMoves.length === 0) {
          return { score: 0 };
        }
      
        const moves = [];
      
        for (let i = 0; i < availableMoves.length; i++) {
          let move = {};
          move.row = availableMoves[i][0];
          move.column = availableMoves[i][1];
          myBoard[move.row][move.column] = player;
      
          if (player === cpu) {
            const result = miniMax(myBoard, human);
            move.score = result.score;
          } else {
            const result = miniMax(myBoard, cpu);
            move.score = result.score;
          }
      
          myBoard[move.row][move.column] = "";
          moves.push(move);
        }
      
        let bestMove = null;
        let bestScore = player === cpu ? -Infinity : Infinity;
      
        for (let i = 0; i < moves.length; i++) {
          if (
            (player === cpu && moves[i].score > bestScore) ||
            (player === human && moves[i].score < bestScore)
          ) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
        
        console.log(moves[bestMove]);
        return moves[bestMove];
      };
      

    const checkTie = function(currentBoard) {
        if(currentBoard.every((currentRow) => currentRow.every((currentCell) => currentCell === human || currentCell === cpu))) return true;
        return false;
    }

    const findMoves = function(currentBoard) {
        const moves = [];
        for(let i = 0; i < currentBoard.length; i++) {
            for(let j = 0; j < currentBoard[i].length; j++){
                if(currentBoard[i][j] != human && currentBoard[i][j] != cpu){
                    moves.push([i, j]);
                }
            }
        }

        return moves;
    }

    const cleanBoard = function() {
        board.forEach((boardRow) => boardRow.forEach((boardColumn) => boardColumn = ""));
    }

    const cleanCells = function() {
        allCells.forEach((currentCell) => {
            currentCell.classList.add("available");
            currentCell.innerText = "";
        })
    }

    const setupGame = function() {
        cleanBoard();
        cleanCells();
        gameOver = false;
    }

    return {
        setupGame,
    }

})(document);

tictactoe.setupGame();