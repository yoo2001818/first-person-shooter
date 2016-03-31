import React, { Component, PropTypes } from 'react';

import Panel from './panel';

export default class CursorPanel extends Component {
  render() {
    return (
      <Panel header='Follow Cursor'>
      </Panel>
    );
  }
}

CursorPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
