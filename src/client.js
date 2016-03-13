import createStore from './store/game';

// Create canvas
let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 800;

let store = createStore(canvas);
store.dispatch({
  type: 'engine/update'
});

let mouseX = 0;
let mouseY = 0;
function handleMouseMove(e) {
  let diffX = e.clientX - mouseX;
  let diffY = e.clientY - mouseY;
  mouseX = e.clientX;
  mouseY = e.clientY;
  store.dispatch({
    type: 'camera/move',
    payload: {
      x: diffX, y: diffY
    }
  });
}

canvas.addEventListener('contextmenu', e => e.preventDefault());

canvas.addEventListener('mousedown', e => {
  if (e.button !== 2) return;
  window.addEventListener('mousemove', handleMouseMove);
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('mouseup', () => {
  window.removeEventListener('mousemove', handleMouseMove);
});

console.log(store);
