import React, { Component, PropTypes } from 'react';

import * as ecsChanges from 'ecsalator/lib/ecs/changes';

import Panel from './panel';

export default class OverviewPanel extends Component {
  handleName(event) {
    const { onEdit, entity } = this.props;
    if (!onEdit) return;
    onEdit(ecsChanges.set(entity, 'name', event.target.value));
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel className='overview'>
        <span className='id'>
          { entity.id }
        </span>
        <span className='name'>
          <input type='text' value={ entity.name }
            onChange={this.handleName.bind(this)}
            />
        </span>
      </Panel>
    );
  }
}

OverviewPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
