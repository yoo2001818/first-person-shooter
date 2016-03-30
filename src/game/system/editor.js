import * as engineActions from '../action/engine';
import * as editorActions from '../action/editor';

import * as editorChanges from '../change/editor';

// A system used for connecting the engine with the editor.
export default class EditorSystem {
  onMount(store) {
    this.store = store;
    store.actions.on(engineActions.INIT, () => {
      store.state.globals.editor = {
        selectedEntity: null
      };
    });
    store.actions.on(editorActions.SELECT_ENTITY, action => {
      store.changes.push(editorChanges.selectEntity(action.payload));
    });
    store.actions.on(editorActions.SET, action => {
      store.changes.push(action.payload);
    });
  }
}
