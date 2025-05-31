
/*const TILE_SIZE = 50 // Declare TILE_SIZE variable
const push = () => {} // Declare push function
const image = (img, x, y, width, height) => {} // Declare image function
const fill = (color) => {} // Declare fill function
const stroke = (color) => {} // Declare stroke function
const strokeWeight = (weight) => {} // Declare strokeWeight function
const rect = (x, y, width, height) => {} // Declare rect function
const noStroke = () => {} // Declare noStroke function
const pop = () => {} // Declare pop function
*/
class Tile {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = TILE_SIZE
    this.height = TILE_SIZE
  }

  draw() {
    push()

    // Usar imagen PNG del tile si está disponible
    if (assets && assets.tileImg) {
      image(assets.tileImg, this.x, this.y, this.width, this.height)
    } else {
      // Fallback: dibujar tile simple
      fill(101, 67, 33) // Color marrón para tierra
      stroke(80, 50, 20)
      strokeWeight(2)
      rect(this.x, this.y, this.width, this.height)

      // Detalles del tile
      fill(120, 80, 40)
      noStroke()
      rect(this.x + 8, this.y + 8, this.width - 16, 12)
      rect(this.x + 12, this.y + 30, this.width - 24, 8)
    }

    pop()
  }
}
