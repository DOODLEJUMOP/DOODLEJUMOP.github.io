const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let score = 0;
let gameOver = false;
let speedMultiplier = 1; // Neue Variable für die Geschwindigkeit

const player = {
    x: canvasWidth / 2 - 25,
    y: canvasHeight - 100,
    width: 25,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    gravity: 0.5,
    jumpStrength: 15,
    movingLeft: false,
    movingRight: false,
    lastJumpTime: 0,
    jumpCooldown: 1000 // Cooldown in Millisekunden
};

const platforms = [];
const platformCount = 10;
const platformWidth = 85;
const platformHeight = 10;

function initPlatforms() {
    // Erste Plattform direkt unter dem Spieler spawnen
    platforms.push({
        x: player.x + player.width / 2 - platformWidth / 2,
        y: player.y + player.height,
        width: platformWidth,
        height: platformHeight
    });

    // Weitere Plattformen zufällig verteilen
    for (let i = 1; i < platformCount; i++) {
        platforms.push({
            x: Math.random() * (canvasWidth - platformWidth),
            y: (canvasHeight / platformCount) * i,
            width: platformWidth,
            height: platformHeight
        });
    }
}

initPlatforms();

function updatePlayer() {
    if (player.movingLeft) {
        player.velocityX = -5;
    } else if (player.movingRight) {
        player.velocityX = 5;
    } else {
        player.velocityX = 0;
    }

    player.x += player.velocityX;

    if (player.y + player.height >= canvasHeight) {
        gameOver = true;
    } else {
        player.velocityY += player.gravity;
    }

    player.y += player.velocityY;

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvasWidth) {
        player.x = canvasWidth - player.width;
    }
}

function checkCollisions() {
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height &&
            player.velocityY > 0) {
            player.velocityY = -player.jumpStrength;
            score++;
        }
    });
}

function updatePlatforms() {
    platforms.forEach(platform => {
        platform.y += player.gravity * speedMultiplier; // Geschwindigkeit mit dem Multiplikator

        if (platform.y > canvasHeight) {
            platform.y = 0;
            platform.x = Math.random() * (canvasWidth - platformWidth);
        }
    });
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'brown';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function increaseSpeed() {
    speedMultiplier += 0.4; // Geschwindigkeit alle 5 Sekunden erhöhen
}

function restartGame() {
    // Setze alle Variablen zurück
    score = 0;
    gameOver = false;
    speedMultiplier = 1;
    platforms.length = 0; // Leere das Plattform-Array
    initPlatforms(); // Erstelle neue Plattformen
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvasWidth / 2 - 100, canvasHeight / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Final Score: ' + score, canvasWidth / 2 - 60, canvasHeight / 2 + 40);
        return;
    }

    clearCanvas();
    updatePlayer();
    updatePlatforms();
    checkCollisions();
    drawPlayer();
    drawPlatforms();
    drawScore();
    requestAnimationFrame(gameLoop);
}

setInterval(increaseSpeed, 15000); // Erhöhe die Geschwindigkeit alle 5 Sekunden

gameLoop();

function handleJump() {
    const currentTime = Date.now();
    if (currentTime - player.lastJumpTime >= player.jumpCooldown) {
        player.velocityY = -player.jumpStrength;
        player.lastJumpTime = currentTime;
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        player.movingLeft = true;
    } else if (e.key === 'ArrowRight') {
        player.movingRight = true;
    } else if (e.key === 'ArrowUp') {
        handleJump();
    } else if (e.code === 'Space') { // Neustart bei Leertaste
        restartGame();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        player.movingLeft = false;
    } else if (e.key === 'ArrowRight') {
        player.movingRight = false;
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A') {
        player.movingLeft = true;
    } else if (e.key === 'd' || e.key === 'D') {
        player.movingRight = true;
    } else if (e.key === 'w' || e.key === 'W') {
        handleJump();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'a' || e.key === 'A') {
        player.movingLeft = false;
    } else if (e.key === 'd' || e.key === 'D') {
        player.movingRight = false;
    }
});
``
