import React, { Component, PropTypes } from 'react';
import Container from '../component/ui/container';
import Header from '../component/header';
import EntityList from '../component/entityList';
import TabBox, { TabPanel } from '../component/ui/tabBox';

export default class EditorApp extends Component {
  render() {
    const { store } = this.props;
    return (
      <div className='app'>
        <Container
          header={<Header title='Game Editor' />}
        >
          <div className='pane-component pane-left'>
            <TabBox>
              <TabPanel title='Entities'>
                <EntityList entities={store.state.entities} />
              </TabPanel>
              <TabPanel title='Hello'>
                World
              </TabPanel>
            </TabBox>
          </div>
          <div className='pane-component pane-center viewport'>
            <h1>Viewport</h1>
          </div>
          <div className='pane-component pane-right'>
            <TabBox>
              <TabPanel title='Properties'>
                Right pane
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
