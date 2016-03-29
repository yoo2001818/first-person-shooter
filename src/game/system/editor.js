import * as editorActions from '../action/editor';

// A system used for connecting the engine with the editor.
export default class EditorSystem {
  onMount(store) {
    this.store = store;
    this.selectedEntity = -1;
    store.actions.on(editorActions.SELECT_ENTITY, action => {
      console.log(action);
    });
  }
}
