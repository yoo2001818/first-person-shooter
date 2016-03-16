import createStore from './store/game';
import RenderView from './view/render';

document.body.style.padding = '0';
document.body.style.margin = '0';

// Create canvas
let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = ((window.innerWidth - 2) / 2 | 0) * 2;
canvas.height = ((window.innerHeight - 2) / 2 | 0) * 2;

window.addEventListener('resize', () => {
  window.requestAnimationFrame(() => {
    canvas.width = ((window.innerWidth - 2) / 2 | 0) * 2;
    canvas.height = ((window.innerHeight - 2) / 2 | 0) * 2;
    view.render();
  });
});

let store = createStore(canvas);

let view = new RenderView(store, canvas);
view.setupEvents();

store.dispatch({
  type: 'engine/init'
});

function update() {
  store.dispatch({
    type: 'engine/update'
  });
  view.render();
  window.requestAnimationFrame(update);
}
update();
console.log(store);
