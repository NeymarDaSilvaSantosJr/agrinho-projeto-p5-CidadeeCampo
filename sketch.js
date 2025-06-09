function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}// Variáveis Globais
let player;
let groundY; // Altura do "chão"
let obstacles = [];
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let gameSpeed = 5; // Velocidade de movimento do cenário e obstáculos
let bgLayers = []; // Para o parallax

// Variáveis de Cenário
let isCity = false; // true para cidade, false para campo

function setup() {
  createCanvas(800, 400); // Ou uma resolução maior
  groundY = height - 50;

  // Inicializa o player
  player = {
    x: width / 4,
    y: groundY,
    width: 30,
    height: 30,
    velocityY: 0,
    isJumping: false,
    color: 'blue' // Mudar cor para campo/cidade
  };

  // Inicializa as camadas de fundo para o parallax
  // Ex: bgLayers.push({ img: loadImage('campo_bg1.png'), speed: 0.5 });
  // bgLayers.push({ img: loadImage('campo_bg2.png'), speed: 1 });
}

function draw() {
  background(220); // Cor de fundo base

  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'playing') {
    updateGame();
    drawGame();
  } else if (gameState === 'gameOver') {
    drawGameOverScreen();
  }
}

function updateGame() {
  // Atualiza o player
  player.velocityY += 0.5; // Gravidade
  player.y += player.velocityY;

  // Colisão com o chão
  if (player.y >= groundY - player.height) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }

  // Mover as camadas de fundo (parallax)
  for (let layer of bgLayers) {
    // layer.x -= layer.speed;
    // Desenhar a imagem aqui
  }

  // Gerar e mover obstáculos
  if (frameCount % 100 === 0) { // Gerar um obstáculo a cada 100 frames (ajustar)
    generateObstacle();
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.x -= gameSpeed;

    // Colisão com obstáculos
    if (collideRectRect(player.x, player.y, player.width, player.height,
                        obs.x, obs.y, obs.width, obs.height)) {
      gameState = 'gameOver';
    }

    // Remover obstáculos que saíram da tela
    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      score++; // Aumentar pontuação
      // Lógica para transição campo/cidade baseada na pontuação?
      // if (score % 50 === 0) toggleCityCountry();
    }
  }

  // Lógica para transição campo/cidade
  // Isso pode ser baseado na pontuação, tempo, ou marcos específicos.
  // Ex: A cada X pontos, muda de cenário.
  // if (score > 0 && score % 100 === 0 && !isCity) {
  //   toggleCityCountry(); // Muda para cidade
  // } else if (score > 0 && score % 100 === 50 && isCity) {
  //   toggleCityCountry(); // Volta para campo
  // }
}

function drawGame() {
  // Desenha o chão
  fill(isCity ? 'gray' : 'green');
  rect(0, groundY, width, height - groundY);

  // Desenha o player
  fill(player.color);
  rect(player.x, player.y, player.width, player.height);

  // Desenha obstáculos
  for (let obs of obstacles) {
    fill(obs.color);
    rect(obs.x, obs.y, obs.width, obs.height);
  }

  // Desenha a pontuação
  fill(0);
  textSize(24);
  text('Pontos: ' + score, 10, 30);
}

function keyPressed() {
  if (keyCode === 32 && gameState === 'playing' && !player.isJumping) { // Barra de espaço
    player.velocityY = -12; // Força do pulo
    player.isJumping = true;
  }
  if (gameState === 'start' && keyCode === 32) {
    gameState = 'playing';
    resetGame(); // Reseta o jogo ao iniciar
  }
  if (gameState === 'gameOver' && keyCode === 32) {
    gameState = 'playing';
    resetGame();
  }
}

function generateObstacle() {
  let obsWidth = random(20, 80);
  let obsHeight = random(30, 100);
  let obsX = width;
  let obsY = groundY - obsHeight;
  let obsColor = isCity ? 'darkblue' : 'brown';
  obstacles.push({ x: obsX, y: obsY, width: obsWidth, height: obsHeight, color: obsColor });
}

function drawStartScreen() {
  background(0);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text('Campo e Cidade Dash!', width / 2, height / 2 - 50);
  textSize(20);
  text('Pressione ESPAÇO para Iniciar', width / 2, height / 2 + 20);
}

function drawGameOverScreen() {
  background(0, 0, 0, 150); // Fundo escuro transparente
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text('GAME OVER!', width / 2, height / 2 - 50);
  textSize(20);
  text('Pontos: ' + score, width / 2, height / 2);
  text('Pressione ESPAÇO para Reiniciar', width / 2, height / 2 + 50);
}

function resetGame() {
  player.y = groundY - player.height;
  player.velocityY = 0;
  player.isJumping = false;
  obstacles = [];
  score = 0;
  gameSpeed = 5;
  isCity = false; // Começa sempre no campo
  player.color = 'blue'; // Volta para a cor inicial
}

function toggleCityCountry() {
  isCity = !isCity;
  // Mudar cores do player, obstáculos, e talvez carregar novas imagens de fundo aqui
  player.color = isCity ? 'orange' : 'blue';
  // Isso exigiria que a função generateObstacle considerasse a mudança de isCity
  // Também precisaria de uma forma de carregar e mudar as imagens de fundo do parallax
}

// Função de colisão retangular (do p5.collide2d ou implementada manualmente)
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  // Retorna true se os retângulos se sobrepõem
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}