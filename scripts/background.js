const STAR_COUNT = 200;

function randomStar(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    color: "white",
  };
}

const can = document.getElementById("canvas");
const ctx = can.getContext("2d");
const stars = Array.from({ length: STAR_COUNT }, () => randomStar(can));

ctx.beginPath();
for (const star of stars) {
  ctx.moveTo(star.x + star.radius, star.y);
  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
}
ctx.fillStyle = "white";
ctx.fill();
