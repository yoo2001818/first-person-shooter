import React, { Component, PropTypes } from 'react';

import { toRadian, toDegree } from '../../../game/util/euler';

import * as ECSChanges from 'ecsalator/lib/ecs/changes';

import Panel from './panel';
import Field from '../ui/field';
import NumberInput from '../ui/numberInput';
import SelectInput from '../ui/selectInput';

export default class CameraPanel extends Component {
  handleChange(key, event) {
    const { onEdit, entity } = this.props;
    if (!onEdit) return;
    onEdit(ECSChanges.set(entity, 'camera', Object.assign({}, entity.camera, {
      [key]: event.target.value
    })));
  }
  handleFov(event) {
    this.handleChange('fov', {
      target: {
        value: toRadian(event.target.value)
      }
    });
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel header='Camera'>
        <Field field='Type'>
          <SelectInput value={ entity.camera.type }
            keys={['Perspective', 'Orthographic']}
            values={['perspective', 'orthographic']}
            onChange={this.handleChange.bind(this, 'type')}
          />
        </Field>
        <Field field='Near'>
          <NumberInput value={ entity.camera.near }
            onChange={this.handleChange.bind(this, 'near')}
          />
        </Field>
        <Field field='Far'>
          <NumberInput value={ entity.camera.far }
            onChange={this.handleChange.bind(this, 'far')}
          />
        </Field>
        {(entity.camera.type === 'perspective') && (
          <Field field='FOV'>
            <NumberInput value={ toDegree(entity.camera.fov) }
              onChange={this.handleFov.bind(this)}
            />
          </Field>
        )}
        {(entity.camera.type === 'orthographic') && (
          <Field field='Scale'>
            <NumberInput value={ entity.camera.fov }
              onChange={this.handleChange.bind(this, 'scale')}
            />
          </Field>
        )}
      </Panel>
    );
  }
}

CameraPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
