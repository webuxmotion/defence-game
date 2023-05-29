const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const scoreEl = document.querySelector('.js-score-number');
const modalEl = document.querySelector('#modalEl');
const modalScoreEl = document.querySelector('#modalScoreEl');
const buttonEl = document.querySelector('#buttonEl');
const startButtonEl = document.querySelector('#startButtonEl')
const startModalEl = document.querySelector('#startModalEl')

let player;
let projectiles = [];
let enemies = [];
let particles = [];
let animationId;
let intervalId;
let score = 0;

function init() {
  player = new Player({
    x: canvas.width / 2, 
    y: canvas.height / 2,
    radius: 10,
    color: "white"
  });
  projectiles = []
  enemies = []
  particles = []
  animationId
  score = 0
  scoreEl.innerHTML = 0
}

const fps = new Fps({ canvasWidth: canvas.width });

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0, 0, 0, 0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index];

    if (particle.alpha === 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  }

  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];

    projectile.update();

    if (
      projectile.x < -projectile.radius ||
      projectile.x > canvas.width + projectile.radius ||
      projectile.y < -projectile.radius ||
      projectile.y > canvas.height + projectile.radius
    ) {
      projectiles.splice(index, 1);
    }
  }

  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index];

    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - player.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      modalEl.style.display = 'block';
      gsap.fromTo(
        '#modalEl',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'expo'
        }
      )
      modalScoreEl.innerHTML = score;
    }

    for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
      const projectile = projectiles[projectileIndex];
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // projectile hits enemy
      if (dist - enemy.radius - projectile.radius < 1) {

        // generate particle explosion
        for (let i = 0; i <= enemy.radius * 2; i++) {
          particles.push(new Particle({
            x: enemy.x,
            y: enemy.y,
            velocity: {
              x: (Math.random() - 0.5) * 6,
              y: (Math.random() - 0.5) * 6,
            },
            radius: Math.random() * 5,
            color: enemy.color,
          }));
        }

        if (enemy.radius - 10 > 10) {
          score += 100;
          scoreEl.innerHTML = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10
          });
          projectiles.splice(projectileIndex, 1);
        } else {

          // remove enemy if they too small
          score += 150;
          scoreEl.innerHTML = score;

          enemies.splice(index, 1);
          projectiles.splice(projectileIndex, 1);
        }
      }
    }
  }

  player.draw();
  fps.update({ c });

}

const spawnEnemies = () => {
  intervalId = setInterval(() => {
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

addEventListener('click', ({ target, clientX, clientY }) => {
  if (target.tagName === "BUTTON") return;
  
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

buttonEl.addEventListener('click', ({ target }) => {
  init()
  animate()
  spawnEnemies()
  gsap.to('#modalEl', {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: 'expo.in',
    onComplete: () => {
      modalEl.style.display = 'none'
    }
  })
});

startButtonEl.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  gsap.to('#startModalEl', {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: 'expo.in',
    onComplete: () => {
      startModalEl.style.display = 'none'
    }
  })
});