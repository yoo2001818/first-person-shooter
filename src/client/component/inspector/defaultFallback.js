import React, { Component, PropTypes } from 'react';

import Panel from './panel';

export default class DefaultFallbackPanel extends Component {
  render() {
    const { name } = this.props;
    return (
      <Panel header={name} className='unspecified'>
        Unspecified
      </Panel>
    );
  }
}

DefaultFallbackPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func,
  name: PropTypes.string
};
