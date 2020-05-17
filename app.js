document.addEventListener("DOMContentLoaded", () => {
  const GRID = document.querySelector(".grid");
  const SCORE_DISPLAY = document.querySelector("#score");
  const START_BTN = document.querySelector("#start-button");
  const COLOR_LIST=["red","darkBlue","lightBlue","green","yellow","purple","orange"]
  const WIDTH = 10;
  const SPEED = 1000;
  const LEFT_MOVE = -1;
  const RIGHT_MOVE = 1;

  //The Tetrominoes
  const L_TETROMINO = [
    [1, WIDTH + 1, WIDTH * 2 + 1, 2],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
    [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2],
  ];

  const L2_TETROMINO =[
    [0,1, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2+2],
    [WIDTH, WIDTH * 2, WIDTH+ 1, WIDTH + 2],
  ];

  const Z_TETROMINO = [
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
  ];

  const Z2_TETROMINO = [
    [1, WIDTH, WIDTH + 1, WIDTH * 2],
    [WIDTH, WIDTH+1, WIDTH*2+1, WIDTH * 2 + 2],
    [1, WIDTH, WIDTH + 1, WIDTH * 2],
    [WIDTH, WIDTH+1, WIDTH*2+1, WIDTH * 2 + 2],
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

  let currentPosition = 4;
  let currentRotation = 0;

  //Randomly select a Tetromino
  let random = 0;
  let current = [];
  startNewTetromino();
  
 

  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 87) {
      rotateTeromino();
    } else if (event.keyCode === 65) {
      moveTetromino(LEFT_MOVE);
    } else if (event.keyCode === 68) {
      moveTetromino(RIGHT_MOVE);
    } else if (event.keyCode === 83) {
      moveTetrominoDown();
    }
  });

  function moveTetromino(movement) {
    undrawTetromino();
    edge = 0;
    if (movement === RIGHT_MOVE) edge = WIDTH-1;
    const isAtEdge = current.some(
      (index) => (currentPosition + index) % WIDTH === edge
    );

    if (!isAtEdge) currentPosition += movement;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    )
      currentPosition += (movement * -1);    
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
      squares[currentPosition + index].classList.add("tetromino",COLOR_LIST[random]);
    });
  }

  function undrawTetromino() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino",COLOR_LIST[random]);
    });
  }

  function rotateTeromino() {
    undrawTetromino();
    currentRotation = (currentRotation + 1) % 4;
    current = THE_TETROMINOES[random][currentRotation];
    drawTetromino();
  }

  //make the tetrimonio move down every second
  timerId = setInterval(moveTetrominoDown, SPEED);

  function startNewTetromino() {
    currentPosition = 4;
    random = Math.floor(Math.random()*1000) % THE_TETROMINOES.length;
    current = THE_TETROMINOES[random][currentRotation];
    drawTetromino();
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
      startNewTetromino();
    }
  }
});
