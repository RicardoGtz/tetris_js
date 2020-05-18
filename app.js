document.addEventListener("DOMContentLoaded", () => {
//CONSTANTS
  const SCORE_DISPLAY = document.querySelector("#score");
  const START_BTN = document.querySelector("#start-button");
  const COLOR_LIST = [
    "red",
    "darkBlue",
    "lightBlue",
    "green",
    "yellow",
    "purple",
    "orange",
  ];
  const WIDTH = 10;
  const SPEED = 1000;
  const LEFT_MOVE = -1;
  const RIGHT_MOVE = 1;

  //The Tetrominoes
  const L_TETROMINO = [
    [0, WIDTH, WIDTH * 2, 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
    [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2],
  ];

  const L2_TETROMINO = [
    [0, 1, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
    [WIDTH, WIDTH * 2, WIDTH + 1, WIDTH + 2],
  ];

  const Z_TETROMINO = [
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
  ];

  const Z2_TETROMINO = [
    [1, WIDTH, WIDTH + 1, WIDTH * 2],
    [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
    [1, WIDTH, WIDTH + 1, WIDTH * 2],
    [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
  ];

  const T_TETROMINO = [
    [1, WIDTH, WIDTH + 1, WIDTH + 2],
    [1, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [1, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
  ];

  const O_TETROMINO = [
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
  ];

  const I_TETROMINO = [
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
  ];

  const THE_TETROMINOES = [
    L_TETROMINO,
    L2_TETROMINO,
    Z_TETROMINO,
    Z2_TETROMINO,
    T_TETROMINO,
    O_TETROMINO,
    I_TETROMINO,
  ];

  let squares = Array.from(document.querySelectorAll(".grid div"));
  let nextTetrominoGrid = Array.from(
    document.querySelectorAll(".nextTetrinomio div")
  );
  let currentPosition = 4;
  let currentRotation = 0;
  let grid = document.querySelector(".grid");
  let random = 0;
  let current = [];
  let currentID = 0;
  let nextTetromino = [];
  let nextID = 0;
  let score = 0;
  let timerId;
  
  //Create a new Tetromino
  createNextTetromino();
  startNewTetromino();

  function moveTetromino(movement) {
    undrawTetromino();
    edge = 0;
    if (movement === RIGHT_MOVE) edge = WIDTH - 1;
    const isAtEdge = current.some(
      (index) => (currentPosition + index) % WIDTH === edge
    );

    if (!isAtEdge) currentPosition += movement;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    )
      currentPosition += movement * -1;
    drawTetromino();
  }

  function moveTetrominoDown() {
    undrawTetromino();
    currentPosition = currentPosition + WIDTH;
    drawTetromino();
    freeze();
  }

  function drawTetromino() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add(
        "tetromino",
        COLOR_LIST[currentID]
      );
    });
  }

  function drawNextTetromino() {
    clearNextDipsplay();
    nextTetromino.forEach((index) => {
      nextTetrominoGrid[
        index >= WIDTH ? index - (WIDTH - 3) * Math.floor(index / WIDTH) : index
      ].classList.add("tetromino", COLOR_LIST[nextID]);
    });
  }

  function undrawTetromino() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove(
        "tetromino",
        COLOR_LIST[currentID]
      );
    });
  }

  function clearNextDipsplay() {
    nextTetrominoGrid.forEach((index) =>
      index.classList.remove("tetromino", COLOR_LIST[nextID])
    );
  }

  function rotateTeromino() {
    undrawTetromino();
    currentRotation = (currentRotation + 1) % THE_TETROMINOES[currentID].length;
    current = THE_TETROMINOES[currentID][currentRotation];
    drawTetromino();
  }

  function startNewTetromino() {
    currentPosition = 4;
    currentID = nextID;
    current = nextTetromino;
    createNextTetromino();
    drawTetromino();
  }

  function createNextTetromino() {
    clearNextDipsplay();
    currentRotation = 0;
    nextID = Math.floor(Math.random() * 1000) % THE_TETROMINOES.length;
    nextTetromino = THE_TETROMINOES[nextID][currentRotation];
    //Draw Next
    drawNextTetromino();
  }

  //freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + WIDTH].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[index + currentPosition].classList.add("taken")
      );
      addScore();     
      startNewTetromino();    
      gameOver();  
    }
  }

  //add funtionality to the button
  START_BTN.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      START_BTN.innerHTML = "Start";
    } else {
      //make the tetrimonio move down every second
      timerId = setInterval(moveTetrominoDown, SPEED);
      START_BTN.innerHTML = "Pause";
    }
  });

  //Controlls
  document.addEventListener("keydown", (event) => {
      if(timerId){
        if (event.keyCode === 87) {
        rotateTeromino();
        } else if (event.keyCode === 65) {
        moveTetromino(LEFT_MOVE);
        } else if (event.keyCode === 68) {
        moveTetromino(RIGHT_MOVE);
        } else if (event.keyCode === 83) {
        moveTetrominoDown();
        }
    }
  });

  //Count  points
  function addScore() {
    for (let i = 0; i < 199; i += WIDTH) {
      const row = [];
      for (let j = 0; j < 10; j++) row.push(i + j);

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        SCORE_DISPLAY.innerHTML = score;
        row.forEach((index) => {
          squares[index].className = "";
        });
        const squaresRemoved = squares.splice(i, WIDTH);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  //Game over function
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      SCORE_DISPLAY.innerHTML = "Game Over: " + SCORE_DISPLAY.innerHTML;
      clearInterval(timerId);
      timerId=null;
    }
  }
});
