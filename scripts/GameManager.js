class GameManager {
  constructor(boardData) {
    this.boardData = new BoardData(boardSize);
    this.turn = TeamColor.WHITE;
    this.prevSquare;
    this.prevValidMoves;
    this.popupArgs;
    this.enPassant;
    this.gameEnded = false;
  }

  selectSquare(e) {
    if (this.gameEnded) {
      return;
    }
    let currentPos = squareToPos(e);
    let isValidMove = false;
    if (this.prevSquare) {
      this.prevSquare.classList.remove('selected-square');
    }

    if (this.prevValidMoves) {
      for (let i = 0; i < this.prevValidMoves.length; i++) {
        this.prevValidMoves[i].classList.remove('valid-move-square');
        isValidMove = (isPosEqual(squareToPos(this.prevValidMoves[i]), currentPos)) || isValidMove;
      }
    }

    if (isValidMove) {
      let piecePos = squareToPos(this.prevSquare);
      boardData.board[piecePos.y][piecePos.x].moveTo(currentPos, false);
      this.prevSquare = undefined;
      this.prevValidMoves = undefined;
    } else {
      e.classList.add('selected-square');
      this.prevSquare = e;

      let piece = boardData.board[currentPos.y][currentPos.x];
      let validMoves;

      piece && piece.color === this.turn ? validMoves = piece.validMoves() : validMoves = [];

      this.removeCheckedSquares(validMoves, piece);

      for (let i = 0; i < validMoves.length; i++) {
        validMoves[i].classList.add('valid-move-square');
      }

      this.prevValidMoves = validMoves;
      return validMoves;
    }
  }

  removeCheckedSquares(validMoves, piece) {
    for (let i = 0; i < validMoves.length; i++) {
      let validMove = validMoves[i];
      let wPiecesCopy = [...boardData.wPieces];
      let bPiecesCopy = [...boardData.bPieces];
      let enPassantCopy = this.enPassant;
      let prevPos = {...piece.pos};
      let validMovePos = squareToPos(validMove);
      piece.moveTo(validMovePos, true);
      if (gameManager._checkForCheck(flipColor(piece.color), false)) {
        validMoves.splice(validMoves.indexOf(validMove), 1);
        i--;
      }
      piece.moveTo(prevPos, true);
      boardData.rollBack(wPiecesCopy, bPiecesCopy);

      this.enPassant = enPassantCopy;
    }
  }

  promotion(pos, color) {
    let popupWindow = document.getElementById((color === TeamColor.WHITE) ? 'w-popup' : 'b-popup' );
    this.popupArgs = {
      color: color,
      pos: pos
    };
    popupWindow.style.visibility = 'visible';
  }

  promotionChoosen() {
    let type = $('input[name="promotion"]:checked');
    if (type) {
      boardData.captureSquare(this.popupArgs.pos);
      let newPiece = boardData.createPiece(type.val(), this.popupArgs.color, this.popupArgs.pos);
      let popupWindow = document.getElementById((this.popupArgs.color === TeamColor.WHITE) ? 'w-popup' : 'b-popup' );
      popupWindow.style.visibility = 'hidden';
      this.popupArgs = undefined;
    }
  }

  changeTurn() {
    let indicator = document.getElementById('turn-indicator');
    this.turn === TeamColor.WHITE ? indicator.classList.add('turn-indicator-b') : indicator.classList.remove('turn-indicator-b');
    this.turn === TeamColor.WHITE ? indicator.innerHTML = 'Black Turn' : indicator.innerHTML = 'White Turn';
    this.turn = this.turn === TeamColor.WHITE ? TeamColor.BLACK : TeamColor.WHITE;
  }

  checkForChecks() {
    this._checkForCheck(TeamColor.WHITE, true);
    this._checkForCheck(TeamColor.BLACK, true);
  }

  _checkForCheck(color, toNotify) {
    let possibleMoves = [];
    let pieces = color === TeamColor.WHITE ? boardData.wPieces : boardData.bPieces;
    for (let piece of pieces) {
      possibleMoves = possibleMoves.concat(piece.validMoves());
    }
    possibleMoves = [...new Set(possibleMoves)];
    let king = getKing(flipColor(color));

    let isCheck = false;

    for (let possibleMove of possibleMoves) {
      if (isPosEqual(squareToPos(possibleMove),king.pos)) {
        isCheck = true;
      }
    }

    let isCheckmate;
    if (isCheck && toNotify) {
      isCheckmate = this.checkForCheckmate(color, possibleMoves);
    }

    isCheck && toNotify && !isCheckmate ? this.notifyCheck(color === TeamColor.WHITE ? 'black' : 'white') : '';
    isCheckmate && toNotify ? this.notifyCheckmate(color === TeamColor.WHITE ? 'White' : 'Black') : '';
    return isCheck;
  }

  checkForCheckmate(color, wPossibleMoves) {
    let bPieces = color === TeamColor.WHITE ? boardData.bPieces : boardData.wPieces;

    let noCheckMove = [];
    for (let bPiece of bPieces) {
      let validMoves = bPiece.validMoves();
      this.removeCheckedSquares(validMoves, bPiece);
      noCheckMove = noCheckMove.concat(validMoves);
    }

    return noCheckMove.length === 0;
  }

  notifyCheck(color) {
    let notification = `The ${color} king is in check.`;
    let overlay = document.getElementsByClassName('popup-notification-overlay')[0];
    overlay.getElementsByTagName('h1')[0].innerHTML = "Check!";
    overlay.getElementsByTagName('h2')[0].innerHTML = notification;
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.visibility = 'hidden';
      }, 1000);
    }, 2000);
  }

  notifyCheckmate(color) {
    this.gameEnded = true;
    let notification = `${color} wins!`;
    let overlay = document.getElementsByClassName('popup-notification-overlay')[0];
    overlay.getElementsByTagName('h1')[0].innerHTML = "Checkmate!";
    overlay.getElementsByTagName('h2')[0].innerHTML = notification;
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
  }
}
