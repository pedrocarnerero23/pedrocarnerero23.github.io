const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Referencias del menú y botones
const menuOverlay = document.getElementById("menuOverlay");
const menuHeader = document.getElementById("menuHeader");
const startGameButton = document.getElementById("startGameButton");
const terminateGameButton = document.getElementById("terminateGameButton");
const playerLeftNameInput = document.getElementById("playerLeftName");
const playerRightNameInput = document.getElementById("playerRightName");
const targetScoreSelect = document.getElementById("targetScore");

// Dimensiones del canvas
const ANCHO = canvas.width;
const ALTO = canvas.height;

// Colores
const BLANCO = "white";
const NEGRO = "black";

// Dimensiones de las palas
const PALA_ANCHO = 15;
const PALA_ALTO = 100;

// Variables para almacenar nombres y puntaje objetivo
let playerLeftName = "Jugador Izquierda";
let playerRightName = "Jugador Derecha";
let gameTargetScore = 10;

// Palas (izquierda y derecha)
const leftPaddle = {
  x: 50,
  y: ALTO / 2 - PALA_ALTO / 2,
  width: PALA_ANCHO,
  height: PALA_ALTO,
  speed: 5,
  previousY: ALTO / 2 - PALA_ALTO / 2,
};

const rightPaddle = {
  x: ANCHO - 50 - PALA_ANCHO,
  y: ALTO / 2 - PALA_ALTO / 2,
  width: PALA_ANCHO,
  height: PALA_ALTO,
  speed: 5,
  previousY: ALTO / 2 - PALA_ALTO / 2,
};

// Definir la pelota
const PELOTA_RADIO = 10;
const ball = {
  x: ANCHO / 2,
  y: ALTO / 2,
  radius: PELOTA_RADIO,
  dx: 5,
  dy: 0,
  spin: 0,
  spin_max: 0,
};

// Variables de puntuación
let scoreLeft = 0;
let scoreRight = 0;

// Estela de la pelota
const TAMAÑO_ESTELA = 15;
let ballTrail = [];

// Manejador de teclado
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Variables para el bucle del juego
let gameRunning = false;
let animationFrameId = null;

// Función de interpolación lineal (lerp)
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Bucle principal usando requestAnimationFrame
function gameLoop() {
  // Si alguno alcanza el puntaje objetivo, se termina la partida
  if (scoreLeft >= gameTargetScore || scoreRight >= gameTargetScore) {
    draw();
    drawGameOver();
    showMenu(true);
    gameRunning = false;
    return;
  }
  
  update();
  draw();
  animationFrameId = requestAnimationFrame(gameLoop);
}

function update() {
  // Guardar posiciones anteriores para calcular la velocidad de las palas
  leftPaddle.previousY = leftPaddle.y;
  rightPaddle.previousY = rightPaddle.y;

   // Movimiento de la pala izquierda: 'w' (arriba) y 's' (abajo)
  if ((keys["w"] || keys["W"]) && leftPaddle.y > 0) {
    leftPaddle.y -= leftPaddle.speed;
  }
  if ((keys["s"] || keys["S"]) && leftPaddle.y + leftPaddle.height < ALTO) {
    leftPaddle.y += leftPaddle.speed;
  }

  // Movimiento de la pala derecha: flechas "ArrowUp" y "ArrowDown"
  if (keys["ArrowUp"] && rightPaddle.y > 0) {
    rightPaddle.y -= rightPaddle.speed;
  }
  if (keys["ArrowDown"] && rightPaddle.y + rightPaddle.height < ALTO) {
    rightPaddle.y += rightPaddle.speed;
  }

  // Calcular la velocidad de las palas (diferencia de posición)
  const leftPaddleVel = leftPaddle.y - leftPaddle.previousY;
  const rightPaddleVel = rightPaddle.y - rightPaddle.previousY;

  // Aceleración de la bola
  const aceleracion_factor = 1.0005;
  ball.dx *= aceleracion_factor;
  ball.dy *= aceleracion_factor;

  // Actualizar posición de la bola
  ball.x += ball.dx;
  ball.y += ball.dy - ball.spin;

  // Actualizar el spin mediante interpolación
  ball.spin = lerp(ball.spin, ball.spin_max, 0.02);

  // Agregar la posición actual de la bola a la estela
  ballTrail.push({ x: ball.x, y: ball.y });
  if (ballTrail.length > TAMAÑO_ESTELA) {
    ballTrail.shift();
  }

  // Rebote en las paredes superior e inferior
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    ball.y = ball.radius;
    ball.spin = 0
    ball.spin_max = ball.dx + ball.spin * PELOTA_RADIO
  }
  if (ball.y + ball.radius > ALTO) {
    ball.dy = -ball.dy;
    ball.y = ALTO - ball.radius;
    ball.spin = 0
    ball.spin_max = ball.dx + ball.spin * PELOTA_RADIO
  }

  // Detección de colisión con la pala izquierda
  if (
    ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
    ball.x - ball.radius > leftPaddle.x &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.height
  ) {
    ball.spin = 0;
    ball.dx = Math.abs(ball.dx); // Siempre hacia la derecha
    ball.dy = ((ball.y - (leftPaddle.y + leftPaddle.height / 2)) / (PALA_ALTO / 2)) * 5;
    ball.spin_max = leftPaddleVel * 1.3;
  }

  // Detección de colisión con la pala derecha
  if (
    ball.x + ball.radius > rightPaddle.x &&
    ball.x + ball.radius < rightPaddle.x + rightPaddle.width &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.height
  ) {
    ball.spin = 0;
    ball.dx = -Math.abs(ball.dx); // Siempre hacia la izquierda
    ball.dy = ((ball.y - (rightPaddle.y + rightPaddle.height / 2)) / (PALA_ALTO / 2)) * 5;
    ball.spin_max = rightPaddleVel * 1.3;
  }

  // Verificar si la bola salió de la pantalla (puntuación)
  if (ball.x - ball.radius <= 0) {
    // Punto para la pala derecha
    scoreRight++;
    resetBall(5);
  } else if (ball.x + ball.radius >= ANCHO) {
    // Punto para la pala izquierda
    scoreLeft++;
    resetBall(-5);
  }
}

function resetBall(initialDx) {
  ball.x = ANCHO / 2;
  ball.y = ALTO / 2;
  ball.dx = initialDx;
  ball.dy = 0;
  ball.spin = 0;
  ball.spin_max = 0;
  ballTrail = [];
}

function draw() {
  // Limpiar el canvas
  ctx.fillStyle = NEGRO;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Dibujar la estela de la bola
  for (let i = 0; i < ballTrail.length; i++) {
    const pos = ballTrail[i];
    let alpha = i / (TAMAÑO_ESTELA - 1);
    if (isNaN(alpha)) alpha = 1;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dibujar el círculo central
  ctx.strokeStyle = BLANCO;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(ANCHO / 2, ALTO / 2, 70, 0, Math.PI * 2);
  ctx.stroke();

  // Dibujar las palas
  ctx.fillStyle = BLANCO;
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Dibujar la bola
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // Mostrar los puntos
  ctx.font = "36px sans-serif";
  ctx.fillStyle = BLANCO;
  const scoreText = `${scoreLeft} - ${scoreRight}`;
  const textWidth = ctx.measureText(scoreText).width;
  ctx.fillText(scoreText, ANCHO / 2 - textWidth / 2, 50);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, ANCHO, ALTO);
  ctx.font = "50px sans-serif";
  ctx.fillStyle = BLANCO;
  let winner = scoreLeft >= gameTargetScore ? playerLeftName : playerRightName;
  let message = `¡Juego terminado! Ganador: ${winner}`;
  let textWidth = ctx.measureText(message).width;
  ctx.fillText(message, ANCHO / 2 - textWidth / 2, ALTO / 2);
}

// Reinicia todos los valores para comenzar un juego nuevo
function resetGame() {
  scoreLeft = 0;
  scoreRight = 0;
  resetBall(5);
  leftPaddle.y = ALTO / 2 - PALA_ALTO / 2;
  rightPaddle.y = ALTO / 2 - PALA_ALTO / 2;
  ballTrail = [];
}

// Muestra el menú. Si gameOver es true se muestra el ganador y se ofrece el botón "Jugar de nuevo".
function showMenu(gameOver = false) {
  if (gameOver) {
    let winner = scoreLeft >= gameTargetScore ? playerLeftName : playerRightName;
    menuHeader.textContent = `¡Juego terminado! Ganador: ${winner}`;
    startGameButton.textContent = "Jugar de nuevo";
  } else {
    menuHeader.textContent = "PONG AI";
    startGameButton.textContent = "Empezar Juego";
  }
  menuOverlay.style.display = "flex";
  terminateGameButton.style.display = "none";
}

// Función para detener el juego manualmente (por el botón "Terminar Juego")
function terminateGame() {
  if (gameRunning) {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    menuHeader.textContent = "Juego cancelado";
    startGameButton.textContent = "Jugar de nuevo";
    menuOverlay.style.display = "flex";
    terminateGameButton.style.display = "none";
  }
}

// Inicia el juego y oculta el menú
function startGame() {
  // Leer nombres y puntaje objetivo desde el menú
  playerLeftName = playerLeftNameInput.value.trim() || "Jugador Izquierda";
  playerRightName = playerRightNameInput.value.trim() || "Jugador Derecha";
  gameTargetScore = Number(targetScoreSelect.value);

  menuOverlay.style.display = "none";
  terminateGameButton.style.display = "block"; // Mostrar botón de terminar durante el juego
  resetGame();
  gameRunning = true;
  gameLoop();
}

// Asignar eventos a los botones
startGameButton.addEventListener("click", startGame);
terminateGameButton.addEventListener("click", terminateGame);
