import React, { Component, PropTypes } from 'react';

import Panel from './panel';

export default class CollisionPanel extends Component {
  render() {
    return (
      <Panel header='Collision'>
      </Panel>
    );
  }
}

CollisionPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
