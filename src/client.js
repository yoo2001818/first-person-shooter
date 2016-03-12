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

console.log(store);
