const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

const gridSize = 10;  // Size of each unit (both snake and fruit)
const boardSize = 400;  // Size of the game canvas

let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 }
]; // Snake starts with 3 segments
let direction = 'RIGHT';
let fruits = []; // Array to hold fruits
let traps = [];
let score = 0;
let gameOver = false;
let gameInterval = 100; // Initial interval (100ms between each game update)

// Function to generate random positions for fruits and traps
function randomPosition() {
    const x = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
    return { x, y };
}

// Initialize fruits and traps
function spawnFruits() {
    // Spawn 3 fruits at random positions if the fruits array is empty
    while (fruits.length < 3) {
        const fruit = randomPosition();
        if (!fruits.some(existingFruit => existingFruit.x === fruit.x && existingFruit.y === fruit.y)) {
            fruits.push(fruit);  // Only add a new fruit if it's not overlapping
        }
    }
}

function spawnTraps() {
    const trap = randomPosition();
    traps.push(trap);
}

// Update the game state
function updateGame() {
    if (gameOver) return;

    moveSnake();
    checkCollisions();
    updateCanvas();
    checkSpeedIncrease();
}

// Move snake based on current direction
function moveSnake() {
    let head = { ...snake[0] };

    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'RIGHT') head.x += gridSize;

    snake.unshift(head);  // Add new head at the front

    // Check if the snake eats a fruit
    for (let i = 0; i < fruits.length; i++) {
        if (head.x === fruits[i].x && head.y === fruits[i].y) {
            score++;
            document.getElementById('score').textContent = score;

            // Remove the eaten fruit
            fruits.splice(i, 1);

            // Respawn only the eaten fruit
            fruits.push(randomPosition());

            spawnTraps();  // Spawn a new trap
            return;  // Don't remove the tail if fruit is eaten
        }
    }

    // Remove tail if no fruit is eaten
    snake.pop();
}

// Check for collisions with traps or itself
function checkCollisions() {
    const head = snake[0];

    // Collision with walls
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        gameOver = true;
    }

    // Collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
        }
    }

    // Collision with traps
    for (let i = 0; i < traps.length; i++) {
        if (traps[i].x === head.x && traps[i].y === head.y) {
            gameOver = true;
        }
    }
}

// Update the canvas with the snake, fruits, and traps
function updateCanvas() {
    ctx.clearRect(0, 0, boardSize, boardSize);  // Clear previous frame

    // Draw the snake (blue color)
    snake.forEach(segment => {
        ctx.fillStyle = "#1E90FF";  // Snake color: Blue
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw the fruits (red circles)
    fruits.forEach(fruit => {
        ctx.fillStyle = "#FF6347";  // Fruit color (Tomato)
        ctx.beginPath();
        ctx.arc(fruit.x + gridSize / 2, fruit.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw the traps (red squares)
    traps.forEach(trap => {
        ctx.fillStyle = "#FF0000";  // Trap color (Red)
        ctx.fillRect(trap.x, trap.y, gridSize, gridSize);  // Trap as square
    });

    // Display game over message if game ends
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.fillText(`Game Over! Score: ${score}`, 100, boardSize / 2);
    }
}

// Check if the snake's speed should increase (every 10 points)
function checkSpeedIncrease() {
    if (score >= 10 && score < 20) {
        if (gameInterval !== 90) {
            updateGameSpeed(80);
        }
    } else if (score >= 20 && score < 30) {
        if (gameInterval !== 80) {
            updateGameSpeed(60);
        }
    } else if (score >= 30 && score < 40) {
        if (gameInterval !== 70) {
            updateGameSpeed(40);
        }
    } else if (score >= 40 && score < 50) {
        if (gameInterval !== 60) {
            updateGameSpeed(20);
        }
    }
    // Add more speed increase logic here if needed (50, 60 points, etc.)
}

// Update the game speed by adjusting the interval
function updateGameSpeed(newInterval) {
    gameInterval = newInterval;
    clearInterval(gameIntervalID);
    gameIntervalID = setInterval(updateGame, gameInterval);  // Update the game interval to a faster rate
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
    gameIntervalID = setInterval(updateGame, gameInterval);  // Start the game with the initial interval
}

let gameIntervalID;  // Variable to hold the game interval ID

startGame();
