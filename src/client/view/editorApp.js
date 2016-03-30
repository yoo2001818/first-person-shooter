import React, { Component, PropTypes } from 'react';
import Container from '../component/ui/container';
import Header from '../component/header';
import EntityList from '../component/entityList';
import EntityInspector from '../component/entityInspector';
import TabBox, { TabPanel } from '../component/ui/tabBox';

import * as editorActions from '../../game/action/editor';

export default class EditorApp extends Component {
  constructor(props) {
    super(props);
  }
  handleSelect(id) {
    this.props.store.dispatch({
      type: editorActions.SELECT_ENTITY,
      payload: id
    });
  }
  render() {
    const { store } = this.props;
    const { editor } = store.state.globals;
    return (
      <div className='app'>
        <Container
          header={<Header title='Game Editor' />}
        >
          <div className='pane-component pane-left'>
            <TabBox>
              <TabPanel title='Entities'>
                <EntityList
                  entities={store.state.entities}
                  selected={editor.selectedEntity}
                  onSelect={this.handleSelect.bind(this)}
                />
              </TabPanel>
              <TabPanel title='Configuration'>
                World
              </TabPanel>
            </TabBox>
          </div>
          <div className='pane-component pane-center viewport'>
          </div>
          <div className='pane-component pane-right'>
            <TabBox>
              <TabPanel title='Inspector'>
                {editor.selectedEntity != null && (
                  <EntityInspector
                    entity={store.state.entities[editor.selectedEntity]}
                    />
                )}
              </TabPanel>
            </TabBox>
          </div>
        </Container>
      </div>
    );
  }
}

EditorApp.propTypes = {
  store: PropTypes.object
};
