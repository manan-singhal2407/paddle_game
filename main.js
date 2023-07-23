var points, lives, text_paddingX, text_paddingY;
var paddle_x, paddle_y, paddle_width, paddle_height, paddle_speed;
var ball_x, ball_y, ball_speedX, ball_speedY, ball_radius;
var brick_paddingX, brick_paddingY, brick_countX, brick_countY, brick_width, brick_height, bricks;

function setup() {
    createCanvas(400, 400);

    points = 0;
    lives = 3;
    text_paddingX = 30;
    text_paddingY = 20;

    paddle_width = 80;
    paddle_height = 10;
    paddle_x = (width - paddle_width) / 2;
    paddle_y = height - 2 * paddle_height;
    paddle_speed = 5;

    ball_radius = 10;
    ball_x = width / 2;
    ball_y = height / 2;
    ball_speedX = random(-3, 3);
    ball_speedY = -3;

    brick_countX = 4;
    brick_countY = 4;
    brick_paddingX = 10;
    brick_paddingY = 5;
    brick_width = (width - (brick_countX + 1) * brick_paddingX) / brick_countX;
    brick_height = 15;
    bricks = createBricks();
}

function createBricks() {
    let bricks = [];
    for (let row = 0; row < brick_countX; row++) {
        for (let col = 0; col < brick_countY; col++) {
            let brick = {
                x: col * brick_width + (col + 1) * brick_paddingX,
                y: row * brick_height + (row + 2) * brick_paddingY + text_paddingY,
                width: brick_width,
                height: brick_height,
                isDestroyed: false,
            };
            bricks.push(brick);
        }
    }
    return bricks;
}

function draw() {
    background("grey");

    if (keyIsDown(LEFT_ARROW) && paddle_x > 0) {
        paddle_x -= paddle_speed;
    }
    if (keyIsDown(RIGHT_ARROW) && paddle_x + paddle_width < width) {
        paddle_x += paddle_speed;
    }

    rect(paddle_x, paddle_y, paddle_width, paddle_height);

    ball_x += ball_speedX;
    ball_y += ball_speedY;

    if (ball_x - ball_radius < 0 || ball_x + ball_radius > width) {
        ball_speedX *= -1;
    }
    if (ball_y - ball_radius < text_paddingY + 2 * brick_paddingY) {
        ball_speedY *= -1;
    }
    if (ball_y >= height - ball_radius) {
        lives--;
        if (lives <= 0) {
            lives = 0;
            ball_speedX = 0;
            ball_speedY = 0;
            updateTextToCenter("GAME OVER");
        } else {
            ball_x = width / 2;
            ball_y = height / 2;
            ball_speedX = random(-3, 3);
            ball_speedY = -3;
        }
    }

    circle(ball_x, ball_y, ball_radius * 2);

    if (
        ball_y + ball_radius > paddle_y &&
        ball_x >= paddle_x &&
        ball_x <= paddle_x + paddle_width
    ) {
        ball_speedY *= -1;
    }

    for (let i = 0; i < bricks.length; i++) {
        let brick = bricks[i];
        if (points === brick_countX * brick_countY) {
            updateTextToCenter("YOU WON");
        }
        if (!brick.isDestroyed) {
            rect(brick.x, brick.y, brick.width, brick.height);
            if (
                ball_y - ball_radius < brick.y + brick.height &&
                ball_y + ball_radius > brick.y &&
                ball_x > brick.x &&
                ball_x < brick.x + brick.width
            ) {
                brick.isDestroyed = true;
                points++;
                ball_speedY *= -1;
            }
        }
    }

    textSize(14);
    fill("white");
    text(`Points: ${points}`, text_paddingX, text_paddingY);
    text(`Lives: ${lives}`, width - 50 - text_paddingX, text_paddingY);
}

function updateTextToCenter(centerText) {
    textSize(30);
    textAlign(CENTER, CENTER);
    text(centerText, width / 2, height / 2);
    noLoop();
}