class Control {
  constructor() {
    this.keys = {}
    this.keyPressed = false
    this.lastKeyPressed = null
  }

  update() {
    // Resetear el estado de tecla presionada cada frame
    this.keyPressed = false
  }

  handleKeyPressed(key) {
    this.keys[key] = true
    this.keyPressed = true
    this.lastKeyPressed = key
    console.log("Tecla presionada:", key) // Debug
  }

  handleKeyReleased(key) {
    this.keys[key] = false
  }

  isKeyDown(key) {
    return this.keys[key] || false
  }

  wasKeyPressed(key) {
    return this.keyPressed && this.lastKeyPressed === key
  }

  // Métodos específicos para el juego
  isJumpPressed() {
    return this.wasKeyPressed("4")
  }

  isRestartPressed() {
    return this.wasKeyPressed("r") || this.wasKeyPressed("R")
  }

  isStartPressed() {
    return this.wasKeyPressed("4")
  }
}
