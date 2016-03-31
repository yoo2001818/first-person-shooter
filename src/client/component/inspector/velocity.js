import React, { Component, PropTypes } from 'react';

import * as velChanges from '../../../game/change/vel';

import Panel from './panel';
import Field from '../ui/field';
import VectorInput from '../ui/vectorInput';

export default class VelocityPanel extends Component {
  handleEdit(event) {
    if (!this.props.onEdit) return;
    this.props.onEdit(velChanges.set(this.props.entity, event.target.value));
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel header='Velocity'>
        <Field field='Velocity'>
          <VectorInput value={ entity.vel }
            onChange={this.handleEdit.bind(this)}
          />
        </Field>
      </Panel>
    );
  }
}

VelocityPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
