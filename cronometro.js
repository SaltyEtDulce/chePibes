class Cronometro {
  constructor() {
    this.tiempo = 0
    this.tiempoInicial = 0
    this.activo = false
    this.lastTime = 0
    this.callbacks = {
      onTimeUpdate: null,
      onTimeEnd: null,
      onLevelTransition: null,
    }
  }

  iniciar(tiempoInicial) {
    this.tiempoInicial = tiempoInicial
    this.tiempo = tiempoInicial
    this.activo = true
    this.lastTime = Date.now()
  }

  pausar() {
    this.activo = false
  }

  reanudar() {
    this.activo = true
    this.lastTime = Date.now()
  }

  detener() {
    this.activo = false
    this.tiempo = 0
  }

  update() {
    if (!this.activo) return

    const currentTime = Date.now()
    if (currentTime - this.lastTime >= 1000) {
      this.tiempo--
      this.lastTime = currentTime

      // Callback de actualización de tiempo
      if (this.callbacks.onTimeUpdate) {
        this.callbacks.onTimeUpdate(this.tiempo)
      }

      // Verificar transición de nivel (75 segundos en nivel 1)
      if (this.tiempo === 75 && this.callbacks.onLevelTransition) {
        this.callbacks.onLevelTransition()
      }

      // Verificar fin de tiempo
      if (this.tiempo <= 0) {
        this.activo = false
        if (this.callbacks.onTimeEnd) {
          this.callbacks.onTimeEnd()
        }
      }
    }
  }

  getTiempo() {
    return this.tiempo
  }

  getTiempoTranscurrido() {
    return this.tiempoInicial - this.tiempo
  }

  getPorcentajeCompletado() {
    return (this.tiempoInicial - this.tiempo) / this.tiempoInicial
  }

  estaActivo() {
    return this.activo
  }

  // Métodos para configurar callbacks
  onTimeUpdate(callback) {
    this.callbacks.onTimeUpdate = callback
  }

  onTimeEnd(callback) {
    this.callbacks.onTimeEnd = callback
  }

  onLevelTransition(callback) {
    this.callbacks.onLevelTransition = callback
  }
}
