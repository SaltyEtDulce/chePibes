class PowerUp {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 40
    this.height = 40
    this.originalY = y
    this.animationOffset = Math.random() * Math.PI * 2
  }

  update() {
    // Animación flotante
    this.y = this.originalY + Math.sin(Date.now() * 0.005 + this.animationOffset) * 8
  }

  draw() {
    const push = window.push
    const sin = window.sin
    const millis = Date.now
    const translate = window.translate
    const rotate = window.rotate
    const tint = window.tint
    const image = window.image
    const noTint = window.noTint
    const fill = window.fill
    const stroke = window.stroke
    const strokeWeight = window.strokeWeight
    const ellipse = window.ellipse
    const triangle = window.triangle
    const pop = window.pop
    const PI = Math.PI
    const cos = Math.cos

    push()

    // Usar imagen PNG si está disponible
    if (assets && assets.powerUpImg) {
      // Efecto de brillo rotativo
      const rotation = millis() * 0.002
      const glow = sin(millis() * 0.01 + this.animationOffset) * 0.3 + 0.7

      translate(this.x + this.width / 2, this.y + this.height / 2)
      rotate(rotation)
      tint(255, 255 * glow, 100)
      image(assets.powerUpImg, -this.width / 2, -this.height / 2, this.width, this.height)
      noTint()
    } else {
      // Fallback: dibujar powerup simple
      const glow = sin(millis() * 0.01 + this.animationOffset) * 0.3 + 0.7

      fill(255 * glow, 215 * glow, 0)
      stroke(255, 255, 100)
      strokeWeight(3)
      ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height)

      // Estrella interior
      fill(255, 255, 200)
      noStroke()
      const centerX = this.x + this.width / 2
      const centerY = this.y + this.height / 2

      for (let i = 0; i < 4; i++) {
        const angle = (i * PI) / 2 + millis() * 0.002
        const x1 = centerX + cos(angle) * 12
        const y1 = centerY + sin(angle) * 12
        const x2 = centerX + cos(angle + PI / 4) * 6
        const y2 = centerY + sin(angle + PI / 4) * 6
        triangle(centerX, centerY, x1, y1, x2, y2)
      }
    }

    pop()
  }
}
