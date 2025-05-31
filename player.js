class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 60
    this.height = 80
    this.velocityY = 0
    this.isGrounded = false
    this.animationFrame = 0
    this.jumpPower = -18
  }

  update() {
    // Movimiento automático hacia la derecha
    this.x += SCROLL_SPEED

    // Aplicar gravedad
    this.velocityY += GRAVITY
    this.y += this.velocityY

    // Verificar colisión con el suelo
    if (this.y >= GROUND_Y - this.height) {
      this.y = GROUND_Y - this.height
      this.velocityY = 0
      this.isGrounded = true
    } else {
      this.isGrounded = false
    }

    // Actualizar animación
    this.animationFrame += 0.2
  }

  jump() {
    if (this.isGrounded) {
      this.velocityY = this.jumpPower
      this.isGrounded = false
      console.log("¡Salto!")
    }
  }

  draw() {
    push()

    // Usar imagen PNG si está disponible
    if (assets && assets.playerImg) {
      tint(255, 150, 200)
      image(assets.playerImg, this.x, this.y, this.width, this.height)
      noTint()
    } else {
      // Fallback: dibujar rectángulo
      fill(colorMode ? color(255, 100, 150) : color(100, 150, 255))
      rect(this.x, this.y, this.width, this.height)

      // Ojos simples
      fill(255)
      const eyeOffset = sin(this.animationFrame) * 2
      ellipse(this.x + 15, this.y + 20 + eyeOffset, 8, 8)
      ellipse(this.x + 45, this.y + 20 + eyeOffset, 8, 8)
    }

    pop()
  }

  // Método para compatibilidad con el sistema de colisiones
  collidesWith(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    )
  }
}

// Variables declaration
const SCROLL_SPEED = 5
const GRAVITY = 0.5
const GROUND_Y = 600
const colorMode = true
const assets = {
  playerImg: null, // Placeholder for the player image
}

// Functions declaration
const push = () => {}
const tint = () => {}
const image = () => {}
const noTint = () => {}
const fill = (param) => {}
const rect = (x, y, width, height) => {}
const sin = (angle) => Math.sin(angle)
const ellipse = (x, y, width, height) => {
  /* Implementation for ellipse */
}
const pop = () => {}
const color = (r, g, b) => `rgb(${r}, ${g}, ${b})`
