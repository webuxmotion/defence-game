const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2 - 200,
}
const R1 = 150;
const R2 = 360;
const AM = R2 - R1;
const h = -100;
let intersects = [];

let angle = Math.PI - Math.PI / 2;
const fps = new Fps({ canvasWidth: canvas.width });

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  angle += 0.005;

  const A = getPointA();
  const M = getPointM();
  const AMAngle = Math.atan2(A.y - M.y, A.x - M.x);
  const R = getPointR(A, AMAngle, AM);
  const L = getPointL(A, AMAngle, AM);
  const RRight = getPointR(A, AMAngle, R2);
  const LLeft = getPointL(A, AMAngle, R2);
  const MRAngle = Math.atan2(M.y - R.y, M.x - R.x);
  const MLAngle = Math.atan2(M.y - L.y, M.x - L.x);

  const edgeSize = 40;
  const points2D = [
    {
      x: center.x - edgeSize,
      y: center.y - edgeSize
    },
    {
      x: center.x + edgeSize,
      y: center.y - edgeSize
    },
    {
      x: center.x + edgeSize,
      y: center.y + edgeSize
    },
    {
      x: center.x - edgeSize,
      y: center.y + edgeSize
    },
  ];
  intersects = [];

  points2D.forEach((point, index) => {
    const P1 = point;
    const P1R = getPointOnCircle(P1, MRAngle, R2 * 2);
    const P1L = getPointOnCircle(P1, MLAngle, R2 * 2);
    const CR = intersect(P1.x, P1.y, P1R.x, P1R.y, LLeft.x, LLeft.y, RRight.x, RRight.y);
    const CL = intersect(P1.x, P1.y, P1L.x, P1L.y, LLeft.x, LLeft.y, RRight.x, RRight.y);
    intersects.push({
      CR, CL
    })
    
    drawPoint({
      id: `Point: ${index}`,
      pointName: `Point: ${index}`,
      x: P1.x,
      y: P1.y,
    });
    drawPoint({
      id: `CR`,
      pointName: `CR`,
      x: CR.x,
      y: CR.y,
    });
    drawPoint({
      id: `CL`,
      pointName: `CL`,
      x: CL.x,
      y: CL.y,
    });
    drawLine(P1, P1R);
    drawLine(P1, P1L);
  });

  drawLine(LLeft, RRight);
  drawLine(M, center);
 
  drawPoint({
    id: 'projection',
    pointName: 'A',
    x: A.x,
    y: A.y,
  });
  drawCircle({
    id: 'white circle',
    pointName: 'center',
    x: center.x,
    y: center.y,
    radius: R1
  });

  // front view

  function getPoints(h) {
    const F = {
      x: canvas.width / 2,
      y: canvas.height / 2 + h
    }
    const H = {
      x: F.x,
      y: F.y - h
    }
    const HR = {
      x: H.x + AM,
      y: H.y
    }
    const HL = {
      x: H.x - AM,
      y: H.y
    }
    const points = [];

    intersects.forEach(({ CR, CL }) => {
      const distR = Math.hypot(A.x - CR.x, A.y - CR.y);
      const distL = Math.hypot(A.x - CL.x, A.y - CL.y);
      
      const FR = {
        x: F.x - distR,
        y: F.y
      }
      const FL = {
        x: F.x + distL,
        y: F.y
      }
  
      drawLine(FR, HR);
      drawLine(FL, HL);
  
      const newPoint = intersect(FR.x, FR.y, HR.x, HR.y, FL.x, FL.y, HL.x, HL.y);
      drawPoint({
        id: 'newPoint',
        pointName: 'newPoint',
        x: newPoint.x,
        y: newPoint.y,
      });
  
      points.push({
        x: newPoint.x,
        y: newPoint.y
      })
    });
    // drawPoint({
    //   id: 'F',
    //   pointName: 'F',
    //   x: F.x,
    //   y: F.y,
    // });
    // drawPoint({
    //   id: 'H',
    //   pointName: 'H',
    //   x: H.x,
    //   y: H.y,
    // });
    drawPoint({
      id: 'HR',
      pointName: 'HR',
      x: HR.x,
      y: HR.y,
    });
    drawPoint({
      id: 'HL',
      pointName: 'HL',
      x: HL.x,
      y: HL.y,
    });

    return points;
  }
  
  [
    getPoints(-200),
    getPoints(-100),
    getPoints(0),
    getPoints(100),
    getPoints(200),
    getPoints(300),
  ].forEach((points) => {
    drawPoints(points);
  })

  fps.update({ c });
}

function getPointA() {
  return getPointOnCircle(center, angle, R1);
}

function getPointM() {
  return getPointOnCircle(center, angle, R2);
}

function getPointR(A, AMAngle, radius) {
  const center = {
    x: A.x,
    y: A.y
  }
  return getPointOnCircle(center, Math.PI / 2 + AMAngle, radius);
}

function getPointL(A, AMAngle, radius) {
  const center = {
    x: A.x,
    y: A.y
  }
  return getPointOnCircle(center, -Math.PI / 2 + AMAngle, radius);
}

function getPointOnCircle(center, angle, radius) {
  const x = center.x + Math.cos(angle) * radius;
  const y = center.y + Math.sin(angle) * radius;

  return { x, y }
}

function drawPoint({ x, y, id, pointName }) {
  c.save();
  c.beginPath();
  c.lineWidth = 1;
  c.fillStyle = "white";
  c.arc(x, y, '6', 0, Math.PI * 2);
  c.fill();

  c.font = "10px Arial";
  c.fillStyle = "white";
  c.fillText(id, x + 10, y);
  c.fillText(`X: ${Math.floor(x)}`, x + 10, y + 16);
  c.fillText(`P: ${pointName}`, x + 10, y + 16 * 2);
  c.save();
  c.translate(x - 5, y);
  c.rotate(-Math.PI / 2);
  c.fillText(`Y: ${Math.floor(y)}`, 0, 0);
  c.restore();

  c.restore();
}

function drawCircle({ x, y, radius, id, pointName }) {
  c.save();
  c.beginPath();
  c.lineWidth = 1;
  c.arc(x, y, radius, 0, Math.PI * 2);
  c.strokeStyle = 'white';
  c.stroke();

  c.font = "16px Arial";
  c.fillStyle = "white";
  c.fillText(id, x, y);
  c.fillText(`X: ${x}`, x, y + 16);
  c.fillText(`R: ${radius}`, x, y + 16 * 2);
  c.fillText(`P: ${pointName}`, x, y + 16 * 3);
  c.save();
  c.translate(x - 5, y);
  c.rotate(-Math.PI / 2);
  c.fillText(`Y: ${y}`, 0, 0);
  c.restore();

  c.restore();
}

function drawLine(p1, p2) {
  c.save();
  c.beginPath();
  c.moveTo(p1.x, p1.y);
  c.lineTo(p2.x, p2.y);
  c.strokeStyle = "white";
  c.stroke();
  c.closePath();
  c.restore();
}

function drawPoints(points) {
  c.save();
  c.strokeStyle = "red";
  c.beginPath();
  points
    .map(({ x, y }, index) => {
      return {
        x: x,
        y: y + 100
      }
    })
    .forEach(({ x, y }, index) => {
      if (index === 0) {
        c.moveTo(x, y);
      } else {
        c.lineTo(x, y);
      }
    });
  c.closePath();
  c.stroke();
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

animate();