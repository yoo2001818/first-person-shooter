import createStore from './store/game';

let store = createStore();

store.dispatch({
  type: 'engine/update'
});
