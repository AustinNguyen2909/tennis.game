let game;
let gameContext;

let ballX = 50;
let ballSpeedX = 8;
let ballY = 50;
const ballSpeedYMax = 20;
let ballSpeedY = 4;

const paddleHeight = 100;
const paddingThickness = 10;

let paddle1Y = 250;
let paddle2Y = 250;
const AIPaddleSpeed = 2.5;

let playerScore = 0;
let computerScore = 0;
const winningScore = 5;
let resetGame = false;

/****************************
 ****** game functions ******
 ****************************/

 /*======== check ball position =========*/
function calculatePaddlePos(evt) {
    let rect = game.getBoundingClientRect();
    let mouseX = evt.clientX - rect.left;
    let mouseY = evt.clientY - rect.top;
    return {
        x: mouseX,
        y: mouseY,
    }
}

/*============== main function onload ================*/
window.onload = function() {
    console.log("Hello World!");
    game = document.getElementById('canvasGame');
    gameContext = game.getContext('2d');
    let framesPerSecond = 40;
    setInterval(function() {
        moveEverything();
        drawEverything();
        ComputerMovement();
    }, 1000 / framesPerSecond);
    setInterval(function() {
        ComputerMovement();
    }, 500 / framesPerSecond);
    game.addEventListener('mousemove',
        function(evt) {
            let mousePos = calculatePaddlePos(evt);
            paddle1Y = mousePos.y - (paddleHeight / 2);
        });
    game.addEventListener("mousedown", handleMouseClick);
}

/*=============== when winning ===============*/
function resetBall() {
    ballX = game.width / 2;
    ballY = game.height / 2;
    ballSpeedY = 5;
    paddle2Y = (game.height / 2) - (paddleHeight / 2);
    if (playerScore == winningScore || computerScore == winningScore) {
        resetGame = true;
    }
}
function handleMouseClick(evt) {
    if (resetGame) {
        playerScore = 0;
        computerScore = 0;
        resetGame = false;
    }
}


/*=============== game movement ===============*/
function ComputerMovement() {
    if (ballY > paddle2Y + (paddleHeight / 6 * 5)) {
        paddle2Y += AIPaddleSpeed;
    } else if (ballY < paddle2Y + (paddleHeight / 6 * 1)) {
        paddle2Y -= AIPaddleSpeed;
    }
}

function changeBallY1Speed() {
    ballSpeedY = ballSpeedYMax * ((ballY - (paddle1Y + (paddleHeight / 2))) / 100);
}

function changeBallY2Speed() {
    ballSpeedY = ballSpeedYMax * ((ballY - (paddle2Y + (paddleHeight / 2))) / 100);
}

function moveEverything() {
    ballY = ballY + ballSpeedY;
    ballX = ballX + ballSpeedX;
    if (ballX <= 10) {
        if (ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            changeBallY1Speed();
        } else {
            computerScore++; //must be before reset
            resetBall();
        }
    }
    if (ballX >= game.width - 10) {
        if (ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            changeBallY2Speed();
        } else {
            playerScore++; //must be before reset
            resetBall();
        }
    }
    if (ballY >= game.height - 5 || ballY <= 5) {
        ballSpeedY = -ballSpeedY;
    }
}

 /**************************************** 
  *** draw the structure of the game ****
  ***************************************/
function drawEverything() {
    drawRect(0, 0, game.width, game.height, 'black'); //this will draw the background of the game
    if (resetGame) {
        if(playerScore >= winningScore) {
            gameContext.fillStyle = 'red';
            gameContext.font = "40px Arial";
            gameContext.fillText("Player won", 290, 250);
        } else if (computerScore >= winningScore) {
            gameContext.fillStyle = 'red';
            gameContext.font = "40px Arial";
            gameContext.fillText("Computer won", 270, 200);
        }
        gameContext.fillStyle = 'white';
        gameContext.font = "40px Arial";
        gameContext.fillText("Click to continue", 250, 350);
        return;
    }
    drawRect(0, paddle1Y, paddingThickness, paddleHeight, 'white'); //this will draw the player paddle of the game
    drawRect(game.width - paddingThickness, paddle2Y, paddingThickness, paddleHeight, 'white'); //this will draw the computer paddle of the game
    drawCir(ballX, ballY, 10, 'white'); //this will draw the ball of the game
    drawNet();
    gameContext.font = "20px Arial";
    gameContext.fillText(playerScore, 200, 100);
    gameContext.fillText(computerScore, game.width - 200, 100);
}

function drawCir(centerX, centerY, radius, cirColor) {
    gameContext.fillStyle = cirColor;
    gameContext.beginPath();
    gameContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    gameContext.fill();
}

function drawRect(leftX, topY, width, height, rectColor) {
    gameContext.fillStyle = rectColor;
    gameContext.fillRect(leftX, topY, width, height);
}

function drawNet() {
    let netPos = 5;
    while (netPos <= 600) {
        gameContext.fillStyle = 'white';
        gameContext.fillRect(398, netPos, 4, 10);
        netPos += 20;
    }
}