import React, { Component, PropTypes } from 'react';
import Container from '../component/ui/container';
import Header from '../component/header';
import EntityList from '../component/entityList';

export default class EditorApp extends Component {
  render() {
    const { store } = this.props;
    return (
      <div className='app'>
        <Container
          header={<Header title='Game Editor' />}
        >
          <EntityList entities={store.state.entities} />
        </Container>
      </div>
    );
  }
}

EditorApp.propTypes = {
  store: PropTypes.object
};
