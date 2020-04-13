const dx = 1;
const dy = 1;
const width = 25;
const height = 100;

let points = -1;

let refreshing = false;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Circle(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
}

function Rectangle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

function Rectangles() {
  this.rectangles = [];

  this.add = (rectangle) => {
    this.rectangles.push(rectangle);
  };

  this.clear = () => {
    this.rectangles = [];
  };
}

const rectangles = new Rectangles();

function createNewColumn() {
  const rectangle = new Rectangle(450, 0, width, height + getRandomInt(10, 250));
  const h = 650 - getRandomInt(0, 250);
  const rectangle2 = new Rectangle(450, h, width, h + height);

  rectangles.add(rectangle);
  rectangles.add(rectangle2);

  points += 1;
}

function rectCircleColliding(circle, rect) {
  const distX = Math.abs(circle.x - rect.x - rect.w / 2);
  const distY = Math.abs(circle.y - rect.y - rect.h / 2);

  if (distX > (rect.w / 2 + circle.r)) { return false; }
  if (distY > (rect.h / 2 + circle.r)) { return false; }

  if (distX <= (rect.w / 2)) { return true; }
  if (distY <= (rect.h / 2)) { return true; }

  const deltax = distX - rect.w / 2;
  const deltay = distY - rect.h / 2;
  return (deltax * deltax + deltay * deltay <= (circle.r * circle.r));
}

createNewColumn();
const circle = new Circle(250, 250, 25);

function doKeyDown(e) {
  if (e.keyCode === 32) {
    refreshing = true;
    circle.y += -50 * dy;
  }
}

function drawBall(ctx, c) {
  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
  ctx.fill();
}

function drawRectangle(ctx, r) {
  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
  ctx.fillRect(r.x, r.y, r.w, r.h);
}

function draw(canvas) {
  if (refreshing) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById('points').innerHTML = points;

    drawBall(ctx, circle);
    circle.y += dy;

    rectangles.rectangles.forEach((r) => {
      drawRectangle(ctx, r);
    });

    if (rectangles.rectangles.length > 0 && rectangles.rectangles[0].x >= -25) {
      rectangles.rectangles[0].x += -dx;
      rectangles.rectangles[1].x += -dx;
    }

    if (rectangles.rectangles.length > 0 && rectangles.rectangles[0].x < -25) {
      rectangles.clear();
      createNewColumn();
    }

    if (rectCircleColliding(circle, rectangles.rectangles[0])
      || rectCircleColliding(circle, rectangles.rectangles[1])) {
      refreshing = false;

      ctx.fillStyle = 'blue';
      ctx.font = 'bold 36px Arial';
      ctx.fillText("You've lost!!!", (canvas.width / 2) - 17, (canvas.height / 2) + 8);
    }
  }
}

// eslint-disable-next-line no-unused-consts
function init() {
  window.addEventListener('keydown', doKeyDown, false);
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const timer = setInterval(draw, 10, canvas);
    return timer;
  }

  return null;
}
