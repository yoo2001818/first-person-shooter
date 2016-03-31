import React, { Component, PropTypes } from 'react';

import * as ecsChanges from 'ecsalator/lib/ecs/changes';

import Panel from './panel';
import Field from '../ui/field';

export default class RenderPanel extends Component {
  handleEdit(event) {
    const { onEdit, entity } = this.props;
    if (!onEdit) return;
    onEdit(ecsChanges.set(entity, 'render', {
      color: event.target.value
    }));
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel header='Render'>
        <Field field='Color'>
          <input type='color' className='input color-input'
            value={ entity.render.color }
            onChange={ this.handleEdit.bind(this) }
          />
        </Field>
      </Panel>
    );
  }
}

RenderPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
