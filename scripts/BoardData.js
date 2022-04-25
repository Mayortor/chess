// BoardData class, cotntains all the data about the board itself and it's variables. Contains all the functions of the board.
class BoardData {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = [];
  }

  // A function which initialize the board and create all the needed HTML elements. By defaults - calls the resetBoard().
  createBoard() {
    // Defining table element
    let table = document.createElement('table');
    // Appending table to body element
    document.getElementsByClassName('chess-div')[0].appendChild(table);

    let r = document.createElement('tr');
    table.appendChild(r);
    r.appendChild(document.createElement('th'));
    for (let i = 0; i < boardSize; i++) {
      let h = document.createElement('th');
      h.classList.add('chess-board-label');
      h.innerHTML = String.fromCharCode('A'.charCodeAt(0)+ i);
      r.appendChild(h)
    }
    // for loop for creating the board squares
    for (let y = 0; y < boardSize; y++) {
      // running and creating the rows (y-axis)
      let row = document.createElement('tr');
      let counter = document.createElement('th');
      counter.innerHTML = y + 1;
      counter.classList.add('chess-board-label');
      row.appendChild(counter);
      // Defining the row
      for (let x = 0; x < boardSize; x++) {
        // running and creating the columns (x-axis)
        let id = `pos${x}-${y}`;
        // Defining a special id to each square
        let square = document.createElement('td');
        // Defining the cell
        square.id = id;
        // Assigning the id to the square
        square.classList.add('chess-square');
        square.setAttribute("onclick", "gameManager.selectSquare(this)")
        // Adding a class to the square (css)
        if ((x + y) % 2 === 0) {
          // formula which desides wheather the square should be white or black
          square.classList.add('white-square');
          // Adding a class to the square (css) *white-square*
        } else {
          square.classList.add('black-square');
          // Adding a class to the square (css) *black-square*
        }
        // creating a image placeholder for the pieces * can ignore for now*
        let piece = document.createElement('img');
        piece.classList.add('chess-piece');

        // Appending placeholder to square
        square.appendChild(piece);
        // Appending square to row
        row.appendChild(square);
      }
      // Appending row to table
      table.appendChild(row);
    }
    this.resetBoard();
  }

  // A function which reset the board to its initial phase. (For future).
  resetBoard() {
    // Reseting board
    this.initializePieces();
  }

  // A function which initialize all the pieces in their correct place.
  // Supports fen notations.
  initializePieces(fenNotation = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {

    // Creating all the pieces
    this.wPieces = [];
    this.bPieces = [];
    this.board = new Array();

    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = new Array();
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = SquareState.EMPTY;
      }
    }

    fenNotation = fenNotation.split(' ');


    let pointer = { x: 0, y: 0 };
    for (const n of fenNotation[0]) {
      if (Number.isInteger(Number(n))) {
        pointer.x += Number(n);
      } else if (n === '/') {
        pointer.x = 0;
        pointer.y++;
      } else {
        const color = n === n.toUpperCase() ? TeamColor.WHITE : TeamColor.BLACK;
        let type;
        switch (n.toLowerCase()) {
          case 'p':
            type = Pawn.TYPE;
            break;
          case 'r':
            type = Rook.TYPE;
            break;
          case 'n':
            type = Knight.TYPE;
            break;
          case 'b':
            type = Bishop.TYPE;
            break;
          case 'q':
            type = Queen.TYPE;
            break;
          case 'k':
            type = King.TYPE;
            break;
        }
        this.createPiece(type, color, {...pointer});
        pointer.x++;
      }
    }

    if (gameManager.turn === TeamColor.WHITE) {
      fenNotation[1] === 'b' ? gameManager.changeTurn() : '';
    } else {
      fenNotation[1] === 'w' ? gameManager.changeTurn() : '';
    }

    if (fenNotation[2] !== '-') {
      fenNotation[2].indexOf('K') !== -1 ? this.board[7][7].isFirstMove = true : '';
      fenNotation[2].indexOf('Q') !== -1 ? this.board[0][7].isFirstMove = true : '';
      fenNotation[2].indexOf('k') !== -1 ? this.board[7][0].isFirstMove = true : '';
      fenNotation[2].indexOf('q') !== -1 ? this.board[0][0].isFirstMove = true : '';
    }
    if (fenNotation[3] !== '-') {
      gameManager.enPassant = this.board[Number(fenNotation[3][0])][Number(fenNotation[3][1])];
    }
  }

  // A function which creates a piece and returns it if needed.
  // type = type of piece, ex. Knight.TYPE.
  // color = team color, ex. TeamColor.WHITE.
  // pos = pos object { x: x, y: y }.
  createPiece(type, color, pos) {
    let piece;
    switch (type) {
      case Pawn.TYPE:
        piece = new Pawn(color, pos);
        break;
      case Rook.TYPE:
        piece = new Rook(color, pos);
        break;
      case Knight.TYPE:
        piece = new Knight(color, pos);
        break;
      case Bishop.TYPE:
        piece = new Bishop(color, pos);
        break;
      case Queen.TYPE:
        piece = new Queen(color, pos);
        break;
      case King.TYPE:
        piece = new King(color, pos);
        break;
    }
    this.board[pos.y][pos.x] = piece;
    (color === TeamColor.WHITE) ? this.wPieces.push(piece) : this.bPieces.push(piece);
    this.drawPiece(piece)
    return piece;
  }

  // A function which takes a piece and draws it on the board.
  drawPiece(piece) {
    let imgPath = `./img/${piece.color}-${piece.type}.png`;
    let pieceImgElement = posToSqaure(piece.pos).getElementsByTagName('img')[0];
    pieceImgElement.src = imgPath;
    pieceImgElement.alt = '';
  }

  // A function which takes a pos object { x: x, y: y } and clears it. (Without removing the piece from the pieces array).
  clearSquare(pos) {
    let pieceImgElement = posToSqaure(pos).getElementsByTagName('img')[0];
    this.board[pos.y][pos.x] = SquareState.EMPTY;
    pieceImgElement.src = '';
  }

  // A function which takes a pos object { x: x, y: y } and captures it. (With removing the piece from the pieces array).
  captureSquare(pos) {
    let piece = this.board[pos.y][pos.x];
    if (piece) {
      piece.color === TeamColor.WHITE ? this.wPieces.splice(this.wPieces.indexOf(piece), 1) : this.bPieces.splice(this.bPieces.indexOf(piece), 1);
    }
    this.board[pos.y][pos.x] = SquareState.EMPTY;
  }

  // A function which clear the board from everything (used for testing).
  clearBoard() {
    this.wPieces = [];
    this.bPieces = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = new Array();
      for (let j = 0; j < this.boardSize; j++) {
        boardData.clearSquare({ x: j, y: i });
      }
    }
  }

  // A function which takes a pos object { x: x, y: y } and a TeamColor. and returns wheater this possition is State.OUT (Out of the board),
  // State.EMPTY (Empty), State.FRIENDLY (Friendly), State.ENEMY (Enemy).
  getPosState(pos, color) {
    if (pos.x > boardData.boardSize - 1 || pos.x < 0 || pos.y > boardData.boardSize - 1 || pos.y < 0) {
      return SquareState.OUT;
    }
    let square = boardData.board[pos.y][pos.x];
    return square !== SquareState.EMPTY ? square.color == color ? SquareState.FRIENDLY : SquareState.ENEMY : SquareState.EMPTY;
  }

  // A function which rolls back the state of the board to when the given pieces were the current state.
  rollBack(wPieces, bPieces) {
    this.wPieces = [...wPieces];
    this.bPieces = [...bPieces];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = new Array();
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = SquareState.EMPTY;
      }
    }

    for (let piece of wPieces) {
      this.board[piece.pos.y][piece.pos.x] = piece;
      this.drawPiece(piece);
    }
    for (let piece of bPieces) {
      this.board[piece.pos.y][piece.pos.x] = piece;
      this.drawPiece(piece);
    }
  }

}
