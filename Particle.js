class Particle {
  constructor({ x, y, radius, color, velocity }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.friction = 0.99;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
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
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;

    if (this.alpha - 0.01 <= 0) {
      this.alpha = 0;
    } else {
      this.alpha -= 0.01;
    }
  }
}