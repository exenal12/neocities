const MIN_DEPTH = 1;
const MAX_DEPTH = 1000;
const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
const isTouchscreen = navigator.maxTouchPoints > 0;
const performanceMode = isSmallScreen && isTouchscreen;
const MAX_RADIUS = isSmallScreen ? 2 : 4; // default max radius on desktop; value changed on mobile devices
const STAR_RADIUS = (zCoord) =>
  Math.max(0, (1 - zCoord / MAX_DEPTH) * MAX_RADIUS);
const STAR_SPEED = 1;
const FOV = 400;
const STAR_COUNT = performanceMode ? 250 : 500;
let CENTER = { X: window.innerWidth / 2, Y: window.innerHeight / 2 };

const can = document.getElementById("canvas");
const ctx = can.getContext("2d");
const isReducedMotion =
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

function randomStar() {
  // z coordinate: the lower the z, the closer it is to the camera
  // radius calculated using z coordinate
  const zCoord = Math.floor(Math.random() * MAX_DEPTH + MIN_DEPTH);
  return {
    x: (Math.random() - 0.5) * window.innerWidth,
    y: (Math.random() - 0.5) * window.innerHeight,
    z: zCoord,
  };
}

function respawn(star) {
  star.x = (Math.random() - 0.5) * window.innerWidth;
  star.y = (Math.random() - 0.5) * window.innerHeight;
  star.z = MAX_DEPTH;
}

/*
animation steps
1. clear screen
2. new path
3. calculate new z
4. check if too close, respawn if needed
5. for each star, calculate radius and projection
6. check if off screen, respawn if needed
7. draw star
*/
function frame() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.beginPath();
  for (const star of stars) {
    if (!isReducedMotion) star.z -= STAR_SPEED;
    if (star.z < MIN_DEPTH) {
      respawn(star);
      continue;
    }
    const x = CENTER.X + (star.x / star.z) * FOV;
    const y = CENTER.Y + (star.y / star.z) * FOV;
    const radius = STAR_RADIUS(star.z);

    const margin = 50;
    const offScreen =
      x < -margin ||
      x > window.innerWidth + margin ||
      y < -margin ||
      y > window.innerHeight + margin;

    if (offScreen) {
      respawn(star);
      continue;
    }
    ctx.moveTo(x + radius, y);
    ctx.arc(x, y, radius, 0, Math.PI * 2);
  }
  ctx.fillStyle = "rgb(94, 94, 94)";
  ctx.fill();
  if (!isReducedMotion) window.requestAnimationFrame(frame);
}

function resize() {
  // handles window resize so the animation doesn't break
  const dpr = window.devicePixelRatio || 1;
  can.width = window.innerWidth * dpr;
  can.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  CENTER = { X: window.innerWidth / 2, Y: window.innerHeight / 2 };
  if (isReducedMotion) frame();
}

function init() {
  resize();
  window.addEventListener("resize", resize);
  window.requestAnimationFrame(frame);
}

const stars = Array.from({ length: STAR_COUNT }, () => randomStar());

init();
