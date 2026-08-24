const STAR_COUNT = 200;
const MIN_DEPTH = 1;
const MAX_DEPTH = 1000;
const MAX_RADIUS = 3;
const STAR_RADIUS = (zCoord) =>
  Math.max(0.5, (1 - zCoord / MAX_DEPTH) * MAX_RADIUS);
const STAR_SPEED = 1;
const FOV = 200;
const CENTER = { X: window.innerWidth / 2, Y: window.innerHeight / 2 };

const can = document.getElementById("canvas");
const ctx = can.getContext("2d");
const dpr = window.devicePixelRatio || 1;
can.width = window.innerWidth * dpr;
can.height = window.innerHeight * dpr;

function randomStar(canvas) {
  // z coordinate: the lower the z, the closer it is to the camera
  // radius calculated using z coordinate
  const zCoord = Math.floor(Math.random() * MAX_DEPTH + MIN_DEPTH);
  return {
    x: (Math.random() - 0.5) * window.innerWidth,
    y: (Math.random() - 0.5) * window.innerHeight,
    z: zCoord,
    color: "white",
  };
}

function frame() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.beginPath();
  for (const star of stars) {
    // reset star if it gets too close
    if (star.z >= MIN_DEPTH) star.z -= STAR_SPEED;
    else {
      star.x = (Math.random() - 0.5) * window.innerWidth;
      star.y = (Math.random() - 0.5) * window.innerHeight;
      star.z = MAX_DEPTH;
    }
    const x = CENTER.X + (star.x / star.z) * FOV;
    const y = CENTER.Y + (star.y / star.z) * FOV;
    const radius = STAR_RADIUS(star.z);

    ctx.moveTo(x + radius, y);
    ctx.arc(x, y, radius, 0, Math.PI * 2);
  }
  ctx.fillStyle = "white";
  ctx.fill();
  window.requestAnimationFrame(frame);
}

/*
animation steps
1. change star z coordinate
2. compute screen position from that state
3. clear canvas
4. draw again with new star state
5. requestAnimationFrame
*/

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
const stars = Array.from({ length: STAR_COUNT }, () => randomStar(can));

window.requestAnimationFrame(frame);
