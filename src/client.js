import createStore from './store/game';
import RenderView from './view/render';

// Create canvas
let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 800;

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
