
// Defining board size;
const boardSize = 8;
// Setting 'load' event
window.addEventListener('load', createBoard);

function createBoard() {
  // Defining table element
  let table = document.createElement('table');
  // Appending table to body element
  document.body.appendChild(table);

  // for loop for creating the board squares
  for (let y = 0; y < boardSize; y++) {
    // running and creating the rows (y-axis)
    let row = document.createElement('tr');
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
      piece.src = "./img/chess-king.png/";
      piece.alt = "";

      // Appending placeholder to square
      square.appendChild(piece);
      // Appending square to row
      row.appendChild(square);
    }
    // Appending row to table
    table.appendChild(row);
  }
}
