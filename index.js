const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor({ x, y, radius, color }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );
    c.fillStyle = this.color;
    c.fill();
  }
}

const player = new Player({
  x: canvas.width / 2, 
  y: canvas.height / 2,
  radius: 30,
  color: "blue"
});

player.draw();