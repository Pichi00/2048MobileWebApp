let touchstartX = 0;
let touchendX = 0;

let touchstartY = 0;
let touchendY = 0;

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
  touchstartY = e.changedTouches[0].screenY;
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  touchendY = e.changedTouches[0].screenY;

  if (touchendX+75 < touchstartX) slideHorizontally(Direction.Left);
  else if (touchendX > touchstartX + 75) slideHorizontally(Direction.Right);
  else if (touchendY+75 < touchstartY) slideVertically(Direction.Up);
  else if (touchendY > touchstartY + 75) slideVertically(Direction.Down);
})
