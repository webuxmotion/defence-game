const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const player = new Player({
  x: canvas.width / 2, 
  y: canvas.height / 2,
  radius: 30,
  color: "blue"
});

const projectiles = [];

const fps = new Fps({ canvasWidth: canvas.width });

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  projectiles.forEach((projectile) => {
    projectile.update();
  })
  player.draw();
  fps.update({ c });
}

addEventListener('click', ({ clientX, clientY }) => {
  const angle = Math.atan2(clientY - player.y, clientX - player.x);
  const x = Math.cos(angle) * 5;
  const y = Math.sin(angle) * 5;
  projectiles.push(new Projectile({
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    velocity: {
      x,
      y
    },
    color: 'red'
  }))
});

animate();