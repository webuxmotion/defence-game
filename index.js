const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
}
const firstRadius = 100;
const secondRadius = 300;
const horHeight = 100;
const rDiff = secondRadius - firstRadius;

const edges = 1;

// const angle = (Math.PI * 2) / edges;

const p1 = {
  x: center.x,
  y: center.y - 40,
}
const p2 = {
  x: center.x + 40,
  y: center.y + 50,
}

let currentAngle = 0;

animate(Math.PI * 3);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  currentAngle += 0.01;

  c.beginPath();
  c.strokeStyle = 'red'
  c.lineWidth = 4
  c.moveTo(p1.x, p1.y);
  c.lineTo(p2.x, p2.y);
  c.stroke();
  c.closePath();
  
  c.beginPath();
  c.lineWidth = 1
  c.arc(center.x, center.y, firstRadius, 0, Math.PI * 2);
  c.strokeStyle = 'white'
  c.stroke();

  
  c.save();
  c.lineWidth = 1
  //const color = `hsl(${Math.random() * 200}, 50%, 50%)`;
  const color = 'white';
  c.strokeStyle = color;
  c.fillStyle = color;

  const x1 = center.x + Math.cos(currentAngle) * firstRadius;
  const y1 = center.y + Math.sin(currentAngle) * firstRadius;
  const x2 = center.x + Math.cos(currentAngle) * secondRadius;
  const y2 = center.y + Math.sin(currentAngle) * secondRadius;

  // const particle = new Particle({ x: x1, y: y1, radius: 3, color, velocity: {x: 0, y: 0} });
  // particle.draw();

  // x2, y2
  const particle2 = new Particle({ x: x2, y: y2, radius: 3, color, velocity: {x: 0, y: 0} });
  particle2.draw();

  c.save();
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
  c.closePath();
  c.restore();

  c.beginPath();
  c.arc(x1, y1, 3, 0, Math.PI * 2);
  c.fill();

  const angle90 = Math.PI / 2;
  const curAngle = Math.atan2(y1 - y2, x1 - x2);

  const x = x1 + Math.cos(angle90 + curAngle) * rDiff;
  const y = y1 + Math.sin(angle90 + curAngle) * rDiff;

  // x, y
  c.beginPath();
  c.arc(x, y, 4, 0, Math.PI * 2);
  c.fill();

  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x, y);
  c.stroke();
  c.closePath();

  const x3 = x1 + Math.cos(angle90 + curAngle + Math.PI) * rDiff;
  const y3 = y1 + Math.sin(angle90 + curAngle + Math.PI) * rDiff;

  c.beginPath();
  c.arc(x3, y3, 4, 0, Math.PI * 2);
  c.fill();

  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x3, y3);
  c.stroke();
  c.closePath();

  function generateLineXY(pointX, pointY) {
    const firstAtan = Math.atan2(y2 - y, x2 - x);
    const firstX = pointX + Math.cos(firstAtan) * 500;
    const firstY = pointY + Math.sin(firstAtan) * 500;
    c.beginPath();
    c.arc(firstX, firstY, 4, 0, Math.PI * 2);
    c.fill();

    c.beginPath();
    c.moveTo(pointX, pointY);
    c.lineTo(firstX, firstY);
    c.stroke();
    c.closePath();

    return [pointX, pointY, firstX, firstY];
  }

  function generateLineX3Y3(pointX, pointY) {
    const firstAtan = Math.atan2(y2 - y3, x2 - x3);
    const firstX = pointX + Math.cos(firstAtan) * 500;
    const firstY = pointY + Math.sin(firstAtan) * 500;
    c.beginPath();
    c.arc(firstX, firstY, 4, 0, Math.PI * 2);
    c.fill();

    c.beginPath();
    c.moveTo(pointX, pointY);
    c.lineTo(firstX, firstY);
    c.stroke();
    c.closePath();

    return [pointX, pointY, firstX, firstY];
  }

  const line1 = generateLineXY(p1.x, p1.y)
  const line2 = generateLineXY(p2.x, p2.y)
  const line3 = generateLineX3Y3(p1.x, p1.y)
  const line4 = generateLineX3Y3(p2.x, p2.y)


  /// generate L2
  const pointL2 = intersect(x, y, x3, y3, line2[0], line2[1], line2[2], line2[3]);
  c.beginPath();
  c.arc(pointL2.x, pointL2.y, 4, 0, Math.PI * 2);
  c.stroke();

  /// generate L1
  const pointL1 = intersect(x, y, x3, y3, line1[0], line1[1], line1[2], line1[3]);
  c.beginPath();
  c.arc(pointL1.x, pointL1.y, 4, 0, Math.PI * 2);
  c.stroke();

  /// generate R1
  const pointR1 = intersect(x, y, x3, y3, line3[0], line3[1], line3[2], line3[3]);
  c.beginPath();
  c.arc(pointR1.x, pointR1.y, 4, 0, Math.PI * 2);
  c.stroke();

  /// generate R2
  const pointR2 = intersect(x, y, x3, y3, line4[0], line4[1], line4[2], line4[3]);
  c.beginPath();
  c.arc(pointR2.x, pointR2.y, 4, 0, Math.PI * 2);
  c.stroke();

  const CL1 = Math.hypot(x1 - pointL1.x, y1 - pointL1.y);
  const CL2 = Math.hypot(x1 - pointL2.x, y1 - pointL2.y);
  const CR1 = Math.hypot(x1 - pointR1.x, y1 - pointR1.y);
  const CR2 = Math.hypot(x1 - pointR2.x, y1 - pointR2.y);

  /*
    DRAW 3D
  */
  function draw3d() {
    const x = canvas.width / 2;
    const y = 200;

    const xl = {
      x: x - rDiff,
      y: y - horHeight
    }
    const xr = {
      x: x + rDiff,
      y: y - horHeight
    }
    

    const l1 = {
      x: x - CL1,
      y
    }
    const l2 = {
      x: x - CL2,
      y
    }
    const r1 = {
      x: x + CR1,
      y
    }
    const r2 = {
      x: x + CR2,
      y
    }

    drawPoint(x, y);
    drawPoint(l1.x, l1.y);
    drawPoint(l2.x, l2.y);
    drawPoint(r1.x, r1.y);
    drawPoint(r2.x, r2.y);
    drawPoint(xl.x, xl.y);
    drawPoint(xr.x, xr.y);

    drawLine(xl, r2);
    drawLine(xl, r1);
    drawLine(xr, l1);
    drawLine(xr, l2);

    const p1 = intersect(xl.x, xl.y, r2.x, r2.y, xr.x, xr.y, l2.x, l2.y);
    const p2 = intersect(xr.x, xr.y, l1.x, l1.y, xl.x, xl.y, r1.x, r1.y);
    drawPoint(p1.x, p1.y);
    drawPoint(p2.x, p2.y);
    drawRedBoldLine(p1, p2);
  }

  draw3d()
  /* end */

  function drawPoint(x, y) {
    c.beginPath();
    c.arc(x, y, 3, 0, Math.PI * 2);
    c.stroke();
  }

  function drawLine(a, b) {
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.stroke();
    c.closePath();
  }

  function drawRedBoldLine(a, b) {
    c.save();
    c.strokeStyle = 'red';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.stroke();
    c.closePath();
    c.restore();
  }

  c.restore();
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

  // Return a object with the x and y coordinates of the intersection
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)

	return {x, y}
}