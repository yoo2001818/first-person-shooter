import React, { Component, PropTypes } from 'react';
import Container from '../component/ui/container';
import Header from '../component/header';
import EntityList from '../component/entityList';
import EntityInspector from '../component/entityInspector';
import TabBox, { TabPanel } from '../component/ui/tabBox';

export default class EditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEntity: 0
    };
  }
  handleSelect(id) {
    this.setState({
      selectedEntity: id
    });
  }
  render() {
    const { store } = this.props;
    const { selectedEntity } = this.state;
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
                  selected={selectedEntity}
                  onSelect={this.handleSelect.bind(this)}
                />
              </TabPanel>
              <TabPanel title='Configuration'>
                World
              </TabPanel>
            </TabBox>
          </div>
          <div className='pane-component pane-center viewport'>
            <h1>Center pane</h1>
          </div>
          <div className='pane-component pane-right'>
            <TabBox>
              <TabPanel title='Inspector'>
                <EntityInspector
                  entity={store.state.entities[selectedEntity]}
                  />
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
