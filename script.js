const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

const gridSize = 10;
const boardSize = 400;

let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 }
];
let direction = 'RIGHT';
let fruits = [];
let traps = [];
let score = 0;
let highScore = 0;
let gameOver = false;
let gameInterval = 100;

// Function to generate random positions for fruits and traps
function randomPosition() {
    const x = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
    return { x, y };
}

// Initialize fruits and traps
function spawnFruits() {
    while (fruits.length < 3) {
        const fruit = randomPosition();
        if (!fruits.some(existingFruit => existingFruit.x === fruit.x && existingFruit.y === fruit.y)) {
            fruits.push(fruit);
        }
    }
}

function spawnTraps() {
    const trap = randomPosition();
    traps.push(trap);
}

// Update the game state
function updateGame() {
    if (gameOver) {
        updateHighScore();  // Update high score if needed when the game ends
        return;
    }

    moveSnake();
    checkCollisions();
    updateCanvas();
}

// Move snake based on current direction
function moveSnake() {
    let head = { ...snake[0] };

    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'RIGHT') head.x += gridSize;

    snake.unshift(head);

    for (let i = 0; i < fruits.length; i++) {
        if (head.x === fruits[i].x && head.y === fruits[i].y) {
            score++;
            document.getElementById('score').textContent = score;

            fruits.splice(i, 1);
            fruits.push(randomPosition());

            spawnTraps();
            return;
        }
    }

    snake.pop();
}

// Check for collisions with traps or itself
function checkCollisions() {
    const head = snake[0];

    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
        }
    }

    for (let i = 0; i < traps.length; i++) {
        if (traps[i].x === head.x && traps[i].y === head.y) {
            gameOver = true;
        }
    }
}

// Update the canvas with the snake, fruits, and traps
function updateCanvas() {
    ctx.clearRect(0, 0, boardSize, boardSize);

    snake.forEach(segment => {
        ctx.fillStyle = "#1E90FF";
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    fruits.forEach(fruit => {
        ctx.fillStyle = "#FF6347";
        ctx.beginPath();
        ctx.arc(fruit.x + gridSize / 2, fruit.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    traps.forEach(trap => {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(trap.x, trap.y, gridSize, gridSize);
    });

    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.fillText(`Game Over! Score: ${score}`, 100, boardSize / 2);
    }
}

// Listen for arrow key inputs
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
});

// Start the game
function startGame() {
    spawnFruits();
    spawnTraps();
    gameIntervalID = setInterval(updateGame, gameInterval);
}

// Reset the game
function resetGame() {
    snake = [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 }
    ];
    direction = 'RIGHT';
    fruits = [];
    traps = [];
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = score;
    
    spawnFruits();
    spawnTraps();
    
    clearInterval(gameIntervalID);
    gameIntervalID = setInterval(updateGame, gameInterval);

    updateCanvas();
}

// Update High Score if necessary
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);  // Save to localStorage
        document.getElementById('high-score').textContent = highScore;  // Update the displayed high score
    }
}

// Load high score from localStorage
function loadHighScore() {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
        highScore = parseInt(storedHighScore);
        document.getElementById('high-score').textContent = highScore;  // Display the loaded high score
    }
}

// Add event listener to reset button
document.getElementById('reset-button').addEventListener('click', resetGame);

// Start the game
startGame();
loadHighScore();
