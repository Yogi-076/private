const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');
const messageEl = document.getElementById('message');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const speedMs = 120;

let snake;
let direction;
let nextDirection;
let food;
let score;
let loopId;
let gameOver;

function randomCell() {
  return Math.floor(Math.random() * tileCount);
}

function placeFood() {
  do {
    food = { x: randomCell(), y: randomCell() };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  scoreEl.textContent = String(score);
  messageEl.hidden = true;
  placeFood();

  if (loopId) clearInterval(loopId);
  loopId = setInterval(tick, speedMs);
  draw();
}

function tick() {
  if (gameOver) return;

  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tileCount ||
    head.y >= tileCount ||
    snake.some((s) => s.x === head.x && s.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = String(score);
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function endGame() {
  gameOver = true;
  messageEl.hidden = false;
  clearInterval(loopId);
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTile(food.x, food.y, '#ffd166');

  snake.forEach((part, i) => {
    drawTile(part.x, part.y, i === 0 ? '#06d6a0' : '#4cc9f0');
  });
}

window.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key === 'ArrowUp' && direction.y !== 1) nextDirection = { x: 0, y: -1 };
  else if (key === 'ArrowDown' && direction.y !== -1) nextDirection = { x: 0, y: 1 };
  else if (key === 'ArrowLeft' && direction.x !== 1) nextDirection = { x: -1, y: 0 };
  else if (key === 'ArrowRight' && direction.x !== -1) nextDirection = { x: 1, y: 0 };
});

restartBtn.addEventListener('click', resetGame);

resetGame();
