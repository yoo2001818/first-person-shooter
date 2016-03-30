import * as EditorChanges from '../change/editor';

const EditorController = {
  [EditorChanges.SELECT_ENTITY]: (event, store) => {
    store.state.globals.editor.selectedEntity = event.data.entity;
  }
};

export default EditorController;
