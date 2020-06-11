var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d'); //tore the 2D rendering context — the actual tool we can use to paint on the Canvas

//ball variables
var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 3;
var dy = -3;

var ballRadius = 10;

//paddle variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

//brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//when any key is pressed down, the keyDownHandler() function will be executed
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

//adding mouse movement
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if( relativeX > 0 && relativeX < canvas.width) {
        //so the mouse movement will actually be relative to the middle of the paddle
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if(e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    }
    else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    }
    else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

//if the ball is between the coordinates of a brick, reverse the direction
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATS!!");
                        document.location.reload();
                        // clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0096DD";
    ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#e60000";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //built in canvas method that will clear the canvas so the ball moving will not leave a trail
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    //when the distance from the center of the ball to the end of the canvas = the ball's radius, the ball will "bounce" the other direction with proper "collision detection"
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    //implementing collision detection with the paddle and allowing losing the game
    else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
                
            if(!lives){
                alert("GAME OVER!!");
                document.location.reload();
                // clearInterval(interval); //needed for chrome to end game
            }
            //resetting the game  if the player still has lives
            else {
                x = canvas.width/2;
                y = canvas.height/30;
                dx = 3;
                dx = -3;
                paddleX = (canvas.width - paddleWidth / 2);
            }
        }    
      
    }

    if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;


    //giving the browser control of the framerate rather than using setInterval
    //the draw function will be executed again and again
    requestAnimationFrame(draw);
}


draw();
//var interval = setInterval(draw, 10);