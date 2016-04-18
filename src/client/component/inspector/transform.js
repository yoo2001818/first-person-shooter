import React, { Component, PropTypes } from 'react';

import * as TransformChanges from '../../../game/change/transform';

import * as Euler from '../../../game/util/euler';

import Panel from './panel';
import Field from '../ui/field';
import Vec3Input from '../ui/vec3Input';

export default class TransformPanel extends Component {
  handlePosition(event) {
    if (!this.props.onEdit) return;
    this.props.onEdit(
      TransformChanges.setPosition(this.props.entity, event.target.value));
  }
  handleScale(event) {
    if (!this.props.onEdit) return;
    this.props.onEdit(
      TransformChanges.setScale(this.props.entity, event.target.value));
  }
  handleRotation(event) {
    if (!this.props.onEdit) return;
    this.props.onEdit(
      TransformChanges.setRotation(this.props.entity,
        Euler.eulerToQuat(event.target.value.map(Euler.toRadian))));
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel header='Transform'>
        <Field field='Position'>
          <Vec3Input value={ entity.transform.position }
            onChange={this.handlePosition.bind(this)}
          />
        </Field>
        <Field field='Scale'>
          <Vec3Input value={ entity.transform.scale }
            onChange={this.handleScale.bind(this)}
          />
        </Field>
        <Field field='Rotation'>
          <Vec3Input
            value={ Euler.quatToEuler(entity.transform.rotation)
              .map(Euler.toDegree) }
            onChange={this.handleRotation.bind(this)}
          />
        </Field>
      </Panel>
    );
  }
}

TransformPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
