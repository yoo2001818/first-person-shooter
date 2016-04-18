import React, { Component, PropTypes } from 'react';

import * as VelocityChanges from '../../../game/change/velocity';

import Panel from './panel';
import Field from '../ui/field';
import Vec3Input from '../ui/vec3Input';

export default class VelocityPanel extends Component {
  handleEdit(event) {
    if (!this.props.onEdit) return;
    this.props.onEdit(VelocityChanges.set(
      this.props.entity, event.target.value));
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel header='Velocity'>
        <Field field='Velocity'>
          <Vec3Input value={ entity.velocity }
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
