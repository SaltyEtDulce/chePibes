class HUD {
  constructor() {
    this.shakeIntensity = 0
    this.notifications = []
  }

  update() {
    // Actualizar shake del HUD
    if (this.shakeIntensity > 0) {
      this.shakeIntensity *= 0.9
      if (this.shakeIntensity < 0.1) this.shakeIntensity = 0
    }

    // Actualizar notificaciones
    for (let i = this.notifications.length - 1; i >= 0; i--) {
      this.notifications[i].timer--
      if (this.notifications[i].timer <= 0) {
        this.notifications.splice(i, 1)
      }
    }
  }

  addNotification(message, duration = 180) {
    this.notifications.push({
      message: message,
      timer: duration,
      y: 200 + this.notifications.length * 30,
    })
  }

  shake(intensity) {
    this.shakeIntensity = intensity
  }
}
