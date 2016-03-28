import './client/style/index.scss';

import React from 'react';
import { render } from 'react-dom';

import createStore from './game/store/game';
import EditorApp from './client/view/editorApp';

let store = createStore();

store.dispatch({
  type: 'engine/init'
});

/*
function update() {
  store.dispatch({
    type: 'engine/update'
  });
  // view.render();
  window.requestAnimationFrame(update);
}
update();
*/

console.log(store);

let container = document.createElement('div');
container.className = 'app-container';
document.body.appendChild(container);
render(<EditorApp store={store} />, container);
