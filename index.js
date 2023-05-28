const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const player = new Player({
  x: canvas.width / 2, 
  y: canvas.height / 2,
  radius: 10,
  color: "white"
});

const projectiles = [];
const enemies = [];
const particles = [];
let animationId;

const fps = new Fps({ canvasWidth: canvas.width });

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0, 0, 0, 0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, index) => {
    if (particle.alpha === 0) {
      console.log('sdfsdf');
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();

    if (
      projectile.x < -projectile.radius ||
      projectile.x > canvas.width + projectile.radius ||
      projectile.y < -projectile.radius ||
      projectile.y > canvas.height + projectile.radius
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - player.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // projectile hits enemy
      if (dist - enemy.radius - projectile.radius < 1) {

        // generate particle explosion
        for (let i = 0; i <= enemy.radius * 2; i++) {
          particles.push(new Particle({
            x: enemy.x,
            y: enemy.y,
            velocity: {
              x: (Math.random() - 0.5) * 4,
              y: (Math.random() - 0.5) * 4,
            },
            radius: Math.random() * 5,
            color: enemy.color,
          }));
        }

        if (enemy.radius - 10 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 10
          });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
  player.draw();
  fps.update({ c });
  
  c.font = "20px Arial";
  c.fillText(enemies.length, 100, 100);
}

const spawnEnemies = () => {
  setInterval(() => {
    const radius = Math.random() * 25 + 5;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    
    const angle = Math.atan2(player.y - y, player.x - x);

    enemies.push(new Enemy({
      x,
      y,
      radius,
      velocity: {
        x: Math.cos(angle) * 1,
        y: Math.sin(angle) * 1,
      },
      color: `hsl(${Math.random() * 200}, 50%, 50%)`
    }));
    if (enemies.length > 20) {
      enemies.shift();
    }
  }, 1000);
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
spawnEnemies();