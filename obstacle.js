class Obstacle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 50
    this.height = 60
    this.animationOffset = Math.random() * Math.PI * 2
  }

  update() {
    // Los obstáculos no necesitan moverse, la cámara maneja el scroll
  }

  draw() {
    const push = () => {}
    const pop = () => {}
    const random = (max) => Math.random() * max
    const TWO_PI = Math.PI * 2
    const sin = Math.sin
    const millis = () => Date.now()
    const tint = () => {}
    const image = () => {}
    const noTint = () => {}
    const fill = () => {}
    const stroke = () => {}
    const strokeWeight = () => {}
    const rect = () => {}
    const noStroke = () => {}
    const triangle = () => {}

    push()

    if (assets && assets.obstacleImg) {
      // Animación de peligro con tinte
      const pulse = sin(millis() * 0.01 + this.animationOffset) * 0.3 + 0.7
      tint(255 * pulse, 100, 100)
      image(assets.obstacleImg, this.x, this.y, this.width, this.height)
      noTint()
    } else {
      // Fallback: dibujar obstáculo simple
      const pulse = sin(millis() * 0.01 + this.animationOffset) * 0.1 + 1

      fill(255 * pulse, 50, 50)
      stroke(200, 0, 0)
      strokeWeight(3)
      rect(this.x, this.y, this.width, this.height)

      // Efecto de espinas
      fill(150, 0, 0)
      noStroke()
      for (let i = 0; i < 4; i++) {
        const spikeX = this.x + (i + 1) * (this.width / 5)
        triangle(spikeX, this.y, spikeX - 5, this.y - 12, spikeX + 5, this.y - 12)
      }
    }

    pop()
  }
}
