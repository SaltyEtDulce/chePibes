// Variables globales del juego
let player
let tiles = []
let obstacles = []
let powerUps = []
let gameState = "start" // 'start', 'level1', 'level2', 'victory', 'gameOver'
let currentLevel = 1
let camera = { x: 0, y: 0, shake: 0 }
let powerUpCount = 0
let isColorEffectActive = false; // Renamed variable
let colorEffectTimer = 0; // Renamed timer

// Instancias de las clases
let control
let colisiones
let hud
let cronometro

// Configuración del juego - CONSTANTES GLOBALES
const GRAVITY = 0.5
const GROUND_Y = 900
const TILE_SIZE = 60
const SCROLL_SPEED = 3

// Declaración de variables necesarias
let createCanvas,
  background,
  fill,
  stroke,
  line,
  width,
  height,
  map,
  color,
  textAlign,
  CENTER,
  textSize,
  ellipse,
  rect,
  random,
  push,
  pop,
  noStroke,
  strokeWeight

function preload() {
  // No cargar imágenes por ahora, usar fallbacks
  console.log("Usando fallbacks para todos los assets")
  assets.backgroundImg = null
  assets.playerImg = null
  assets.tileImg = null
  assets.obstacleImg = null
  assets.powerUpImg = null
}

function setup() {
  createCanvas = window.createCanvas
  createCanvas(1920, 1080)

  // Inicializar clases del sistema
  control = new Control()
  colisiones = new Colisiones()
  hud = new HUD()
  cronometro = new Cronometro()

  // Configurar callbacks del cronómetro
  cronometro.onLevelTransition(() => {
    if (currentLevel === 1) {
      startLevel2()
    }
  })

  cronometro.onTimeEnd(() => {
    if (currentLevel === 2) {
      gameState = "victory"
    }
  })

  console.log("Juego inicializado. Presiona '4' para comenzar.")
}

function draw() {
  background = window.background
  background(0)

  // Actualizar sistemas
  control.update()
  hud.update()

  switch (gameState) {
    case "start":
      drawStartScreen()
      // CORREGIDO: Verificar si se presionó la tecla 4
      if (control.isStartPressed()) {
        console.log("Iniciando Nivel 1...")
        startLevel1()
      }
      break
    case "level1":
    case "level2":
      updateGame()
      drawGame()
      drawGameUI()
      // CORREGIDO: Verificar salto
      if (control.isJumpPressed()) {
        player.jump()
      }
      break
    case "victory":
      drawVictoryScreen()
      if (control.isRestartPressed()) {
        resetGame()
      }
      break
    case "gameOver":
      drawGameOverScreen()
      if (control.isRestartPressed()) {
        resetGame()
      }
      break
  }
}

function drawStartScreen() {
  // Fondo degradado simple
  for (let i = 0; i <= window.height; i++) {
    const inter = map(i, 0, window.height, 0, 1)
    const c = lerpColor(color(25, 25, 112), color(135, 206, 235), inter)
    stroke = window.stroke
    stroke(c)
    line = window.line
    line(0, i, window.width, i)
  }

  // Título principal
  fill = window.fill
  fill(255)
  textAlign = window.textAlign
  textAlign(window.CENTER)
  textSize = window.textSize
  textSize(120)
  window.text("CHE PIBES", window.width / 2, window.height / 2 - 200)

  textSize(60)
  fill(255, 215, 0)
  window.text("AVENTURA RUNNER", window.width / 2, window.height / 2 - 100)

  // Instrucciones
  fill(255)
  textSize(40)
  window.text("Presiona '4' para comenzar", window.width / 2, window.height / 2 + 50)

  textSize(30)
  fill(200)
  window.text("Nivel 1: 75 seg → Nivel 2: 90 seg → ¡Victoria!", window.width / 2, window.height / 2 + 120)

  // Debug info
  fill(255, 0, 0)
  textSize(20)
  window.text("Debug: Estado actual = " + gameState, window.width / 2, window.height - 50)
}

function drawVictoryScreen() {
  // Fondo celebratorio
  for (let i = 0; i <= window.height; i++) {
    const inter = map(i, 0, window.height, 0, 1)
    const c = lerpColor(color(255, 215, 0), color(255, 140, 0), inter)
    stroke(c)
    line(0, i, window.width, i)
  }

  fill(255)
  textAlign(window.CENTER)
  textSize(100)
  window.text("¡GANASTE!", window.width / 2, window.height / 2 - 100)

  textSize(50)
  fill(0)
  window.text("¡Completaste todos los niveles!", window.width / 2, window.height / 2)

  textSize(40)
  fill(255)
  window.text("Presiona 'R' para jugar de nuevo", window.width / 2, window.height / 2 + 100)
}

function drawGameOverScreen() {
  // Fondo rojo oscuro
  for (let i = 0; i <= window.height; i++) {
    const inter = map(i, 0, window.height, 0, 1)
    const c = lerpColor(color(139, 0, 0), color(0, 0, 0), inter)
    stroke(c)
    line(0, i, window.width, i)
  }

  fill(255, 0, 0)
  textAlign(window.CENTER)
  textSize(100)
  window.text("GAME OVER", window.width / 2, window.height / 2 - 100)

  textSize(50)
  fill(255)
  window.text(`Llegaste al Nivel ${currentLevel}`, window.width / 2, window.height / 2)

  textSize(40)
  window.text("Presiona 'R' para intentar de nuevo", window.width / 2, window.height / 2 + 100)
}

function updateCamera() {
  // Seguir al jugador
  camera.x = player.x - window.width / 3

  // Shake de cámara
  if (camera.shake > 0) {
    camera.shake *= 0.9
    if (camera.shake < 0.1) camera.shake = 0
  }
}

function updateGame() {
  cronometro.update()

  if (gameState !== "level1" && gameState !== "level2") return

  updateCamera()

  // Actualizar modo color
  if (colorMode) {
    colorModeTimer--
    if (colorModeTimer <= 0) {
      colorMode = false
    }
  }

  // Actualizar jugador
  player.update()

  // Actualizar obstáculos
  for (const obstacle of obstacles) {
    obstacle.update()
  }

  // Actualizar powerups
  for (const powerUp of powerUps) {
    powerUp.update()
  }

  generateElements()
  checkCollisions()
  cleanupElements()
}

function drawGame() {
  push = window.push
  push()

  // Aplicar shake de cámara
  if (camera.shake > 0) {
    translate = window.translate
    translate(random(-camera.shake, camera.shake), random(-camera.shake, camera.shake))
  }

  // Dibujar fondo
  drawBackground()

  translate(-camera.x, 0)

  // Dibujar tiles del suelo
  for (const tile of tiles) {
    tile.draw()
  }

  // Dibujar obstáculos
  for (const obstacle of obstacles) {
    obstacle.draw()
  }

  // Dibujar powerups
  for (const powerUp of powerUps) {
    powerUp.draw()
  }

  // Dibujar jugador
  player.draw()

  pop = window.pop
  pop()
}

function drawBackground() {
  // Fondo degradado con paralaje
  const parallaxOffset = camera.x * 0.1

  for (let i = 0; i <= window.height; i++) {
    const inter = map(i, 0, window.height, 0, 1)
    const c = colorMode
      ? lerpColor(color(255, 100, 150), color(100, 150, 255), inter)
      : lerpColor(color(135, 206, 235), color(25, 25, 112), inter)
    stroke(c)
    line(0, i, window.width, i)
  }

  // Nubes simples para efecto de paralaje
  fill(255, 255, 255, 100)
  noStroke = window.noStroke
  noStroke()
  for (let i = 0; i < 5; i++) {
    const cloudX = (i * 400 - parallaxOffset) % (window.width + 200)
    const cloudY = 100 + i * 50
    ellipse = window.ellipse
    ellipse(cloudX, cloudY, 80, 40)
    ellipse(cloudX + 30, cloudY, 60, 30)
    ellipse(cloudX - 30, cloudY, 60, 30)
  }
}

function drawGameUI() {
  // Fondo semi-transparente para UI
  fill(0, 0, 0, 150)
  noStroke()
  rect(0, 0, window.width, 120)

  // Nivel actual
  fill(255, 215, 0)
  textSize(40)
  textAlign(window.LEFT)
  window.text(`NIVEL ${currentLevel}`, 40, 50)

  // Timer con colores según el tiempo restante
  let timerColor = color(255)
  const tiempo = cronometro.getTiempo()
  if (tiempo <= 15) {
    timerColor = color(255, 100, 100)
  } else if (tiempo <= 30) {
    timerColor = color(255, 200, 100)
  }

  fill(timerColor)
  textSize(36)
  window.text(`Tiempo: ${tiempo}s`, 40, 100)

  // Indicador de transición de nivel
  if (currentLevel === 1 && tiempo <= 75 && tiempo > 70) {
    fill(255, 215, 0)
    textSize(28)
    textAlign(window.CENTER)
    window.text("¡Preparándose para Nivel 2!", window.width / 2, 30)
  }

  // Barra de progreso de powerups
  drawPowerUpBar()

  // Indicador de modo color
  if (colorMode) {
    fill(255, 100, 150)
    textSize(32)
    textAlign(window.CENTER)
    const remaining = Math.ceil(colorModeTimer / 60)
    window.text(`¡MODO COLOR ACTIVADO! (${remaining}s)`, window.width / 2, window.height - 80)
  }

  // Instrucciones
  fill(255)
  textSize(24)
  textAlign(window.RIGHT)
  window.text("Presiona '4' para saltar", window.width - 40, 50)
}

function drawPowerUpBar() {
  const barWidth = 300
  const barHeight = 20
  const barX = window.width / 2 - barWidth / 2
  const barY = 65

  // Título de la barra
  fill(255)
  textSize(24)
  textAlign(window.CENTER)
  window.text("PowerUps:", window.width / 2, 50)

  // Fondo de la barra
  fill(50)
  rect(0, 0, window.width, window.height)

  // Progreso
  const progress = powerUpCount / 3
  fill(colorMode ? color(255, 100, 150) : color(100, 255, 100))
  rect(barX, barY, barWidth * progress, barHeight)

  // Marcadores de progreso
  stroke(255)
  strokeWeight(2)
  for (let i = 1; i < 3; i++) {
    const x = barX + (barWidth / 3) * i
    line(0, 0, window.width, window.height)
  }

  // Borde de la barra
  noFill()
  stroke(255)
  strokeWeight(2)
  rect(barX, barY, barWidth, barHeight)

  // Contador numérico
  fill(255)
  textSize(18)
  window.text(`${powerUpCount}/3`, window.width / 2, barY + 35)
}

function generateElements() {
  // Generar nuevos tiles
  while (tiles.length === 0 || tiles[tiles.length - 1].x < camera.x + window.width + 200) {
    const lastTile = tiles.length > 0 ? tiles[tiles.length - 1] : { x: -TILE_SIZE }
    tiles.push(new Tile(lastTile.x + TILE_SIZE, GROUND_Y))
  }

  // Generar obstáculos aleatoriamente
  const obstacleChance = currentLevel === 2 ? 0.015 : 0.01
  if (random() < obstacleChance) {
    obstacles.push(new Obstacle(camera.x + window.width + 100, GROUND_Y - 60))
  }

  // Generar powerups aleatoriamente
  if (random() < 0.008) {
    powerUps.push(new PowerUp(camera.x + window.width + 100, GROUND_Y - 100))
  }
}

function checkCollisions() {
  // Verificar colisiones con obstáculos
  const hitObstacle = colisiones.checkPlayerObstacles(player, obstacles)
  if (hitObstacle) {
    gameState = "gameOver"
    camera.shake = 30
    cronometro.detener()
    console.log("Game Over - Colisión con obstáculo")
    return
  }

  // Verificar colisiones con powerups
  const collectedPowerUps = colisiones.checkPlayerPowerUps(player, powerUps)
  for (const powerUp of collectedPowerUps) {
    powerUpCount++
    console.log(`PowerUp recolectado! Total: ${powerUpCount}/3`)

    if (powerUpCount >= 3) {
      powerUpCount = 0
      colorMode = true
      colorModeTimer = 300
      camera.shake = 15
      console.log("¡Modo Color Activado!")
    }
  }
}

function cleanupElements() {
  tiles = tiles.filter((tile) => tile.x > camera.x - 200)
  obstacles = obstacles.filter((obstacle) => obstacle.x > camera.x - 200)
  powerUps = powerUps.filter((powerUp) => powerUp.x > camera.x - 200)
}

function startLevel1() {
  gameState = "level1"
  currentLevel = 1
  powerUpCount = 0
  colorMode = false
  colorModeTimer = 0
  camera = { x: 0, y: 0, shake: 0 }

  player = new Player(200, GROUND_Y - 80)

  tiles = []
  obstacles = []
  powerUps = []

  createInitialElements()

  cronometro.iniciar(90)
  console.log("Nivel 1 iniciado!")
}

function startLevel2() {
  gameState = "level2"
  currentLevel = 2
  camera.shake = 20

  obstacles = []
  powerUps = []

  cronometro.iniciar(90)
  console.log("¡Nivel 2 iniciado! Más difícil!")
}

function resetGame() {
  gameState = "start"
  currentLevel = 1
  powerUpCount = 0
  colorMode = false
  colorModeTimer = 0
  camera = { x: 0, y: 0, shake: 0 }

  tiles = []
  obstacles = []
  powerUps = []

  cronometro.detener()
  console.log("Juego reiniciado")
}

function createInitialElements() {
  // Crear tiles iniciales del suelo
  for (let x = -200; x < window.width + 400; x += TILE_SIZE) {
    tiles.push(new Tile(x, GROUND_Y))
  }

  // Crear algunos obstáculos iniciales
  for (let i = 0; i < 2; i++) {
    obstacles.push(new Obstacle(600 + i * 400, GROUND_Y - 60))
  }

  // Crear algunos powerups iniciales
  for (let i = 0; i < 2; i++) {
    powerUps.push(new PowerUp(800 + i * 500, GROUND_Y - 100))
  }
}

// CORREGIDO: Funciones de eventos de teclado
function keyPressed() {
  console.log("Tecla presionada:", window.key) // Debug
  control.handleKeyPressed(window.key)
}

function keyReleased() {
  control.handleKeyReleased(window.key)
}

// Funciones auxiliares
function lerpColor(c1, c2, amt) {
  const r = lerp(window.red(c1), window.red(c2), amt)
  const g = lerp(window.green(c1), window.green(c2), amt)
  const b = lerp(window.blue(c1), window.blue(c2), amt)
  return color(r, g, b)
}

function lerp(start, stop, amt) {
  return (1 - amt) * start + amt * stop
}

// Declaración de clases necesarias
class Control {
  isStartPressed() {
    return window.key === "4"
  }

  isJumpPressed() {
    return window.key === "4"
  }

  isRestartPressed() {
    return window.key === "R"
  }

  handleKeyPressed(key) {
    // Manejo de eventos de teclado
  }

  handleKeyReleased(key) {
    // Manejo de eventos de teclado liberados
  }

  update() {
    // Actualización del control
  }
}

class Colisiones {
  checkPlayerObstacles(player, obstacles) {
    // Lógica de colisión con obstáculos
    return false
  }

  checkPlayerPowerUps(player, powerUps) {
    // Lógica de colisión con powerups
    return []
  }
}

class HUD {
  update() {
    // Actualización de la interfaz de usuario
  }
}

class Cronometro {
  iniciar(tiempo) {
    // Iniciar el cronómetro
  }

  detener() {
    // Detener el cronómetro
  }

  update() {
    // Actualización del cronómetro
  }

  getTiempo() {
    // Obtener el tiempo restante
    return 90
  }

  onLevelTransition(callback) {
    // Configurar callback para transición de nivel
  }

  onTimeEnd(callback) {
    // Configurar callback para fin de tiempo
  }
}

class Tile {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw() {
    // Dibujar tile
  }

  update() {
    // Actualizar tile
  }
}

class Obstacle {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw() {
    // Dibujar obstáculo
  }

  update() {
    // Actualizar obstáculo
  }
}

class PowerUp {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw() {
    // Dibujar powerup
  }

  update() {
    // Actualizar powerup
  }
}
