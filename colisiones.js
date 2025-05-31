class Colisiones {
  constructor() {
    this.collisionBuffer = 5 // Buffer para hacer las colisiones menos estrictas
  }

  // Verificar colisión entre dos rectángulos
  rectRect(obj1, obj2) {
    return (
      obj1.x + this.collisionBuffer < obj2.x + obj2.width - this.collisionBuffer &&
      obj1.x + obj1.width - this.collisionBuffer > obj2.x + this.collisionBuffer &&
      obj1.y + this.collisionBuffer < obj2.y + obj2.height - this.collisionBuffer &&
      obj1.y + obj1.height - this.collisionBuffer > obj2.y + this.collisionBuffer
    )
  }

  // Verificar colisión entre círculo y rectángulo
  circleRect(circle, rect) {
    const centerX = circle.x + circle.width / 2
    const centerY = circle.y + circle.height / 2
    const radius = circle.width / 2

    const closestX = Math.max(rect.x, Math.min(centerX, rect.x + rect.width))
    const closestY = Math.max(rect.y, Math.min(centerY, rect.y + rect.height))

    const distanceX = centerX - closestX
    const distanceY = centerY - closestY

    return distanceX * distanceX + distanceY * distanceY < radius * radius
  }

  // Verificar colisión del jugador con obstáculos
  checkPlayerObstacles(player, obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
      if (this.rectRect(player, obstacles[i])) {
        return obstacles[i]
      }
    }
    return null
  }

  // Verificar colisión del jugador con powerups
  checkPlayerPowerUps(player, powerUps) {
    const collectedPowerUps = []
    for (let i = powerUps.length - 1; i >= 0; i--) {
      if (this.circleRect(powerUps[i], player)) {
        collectedPowerUps.push(powerUps.splice(i, 1)[0])
      }
    }
    return collectedPowerUps
  }

  // Verificar si el jugador está en el suelo
  checkPlayerGround(player, groundY) {
    return player.y + player.height >= groundY
  }
}
