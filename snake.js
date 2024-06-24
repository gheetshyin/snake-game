// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Set the scale for the grid
const scale = 20;
// Calculate the number of rows and columns based on the canvas size and scale
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let snake;

// Setup function to initialize the game
(function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    // Game loop: clear the canvas, draw the fruit, update and draw the snake every 250ms
    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();

        // Check if the snake eats the fruit
        if (snake.eat(fruit)) {
            fruit.pickLocation();
        }

        // Check for collision with the snake itself
        snake.checkCollision();
        // Update the score display (assuming there's an element with class 'score' in your HTML)
        document.querySelector('.score').innerText = snake.total;
    }, 250);
}());

// Event listener for keyboard input to control the snake's direction
window.addEventListener('keydown', e => {
    const direction = e.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

// Snake constructor function
function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1; // Moving right initially
    this.ySpeed = 0;
    this.total = 0; // Length of the snake
    this.tail = []; // Array to store the coordinates of the snake's body

    // Draw the snake on the canvas
    this.draw = function() {
        ctx.fillStyle = "#FFFFFF";

        for (let i=0; i<this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    };

    // Update the snake's position
    this.update = function() {
        // Move the tail
        for (let i=0; i<this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i+1];
        }

        // Set the last segment of the tail to the head's previous position
        this.tail[this.total - 1] = { x: this.x, y: this.y };

        // Move the head
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Wrap the snake position horizontally on the canvas
        if (this.x >= canvas.width) {
            this.x = 0;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    };

    // Change the direction of the snake based on keyboard input
    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    // Check if the snake eats the fruit
    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }

        return false;
    };

    // Check for collision with the snake itself
    this.checkCollision = function() {
        for (let i=0; i<this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.total = 0;
                this.tail = [];
            }
        }
    };
}

// Fruit constructor function
function Fruit() {
    this.x;
    this.y;

    // Randomly place the fruit on the canvas
    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    };

    // Draw the fruit on the canvas
    this.draw = function() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}