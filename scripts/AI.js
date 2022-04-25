const Value = {
  'pawn': 100,
  'knight': 300,
  'bishop': 300,
  'rook': 500,
  'queen': 900
}

function evaluate() {
  let whiteEval = countEvaluation(TeamColor.WHITE);
  let blackEval = countEvaluation(TeamColor.BLACK);

  let evaluation = whiteEval - blackEval;
  return gameManager.turn === TeamColor.WHITE ? evaluation : -evaluation;
}

function countEvaluation(team) {
  let pieces = team === TeamColor.WHITE ? boardData.wPieces : boardData.bPieces;
  let evaluation = 0;

  for (const piece of pieces) {
    evaluation += Value[piece.type];
  }

  return evaluation;
}
