import React, { Component, PropTypes } from 'react';

import * as ECSChanges from 'ecsalator/lib/ecs/changes';

import Panel from './panel';
import Field from '../ui/field';
import NumberInput from '../ui/numberInput';
import Vec2Input from '../ui/vec2Input';
import Vec3Input from '../ui/vec3Input';
import SelectInput from '../ui/selectInput';
import ColorVec3Input from '../ui/colorVec3Input';

export default class LightPanel extends Component {
  handleChange(key, event) {
    const { onEdit, entity } = this.props;
    if (!onEdit) return;
    onEdit(ECSChanges.set(entity, 'light', Object.assign({}, entity.light, {
      [key]: event.target.value
    })));
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel header='Light'>
        <Field field='Type'>
          <SelectInput value={ entity.light.type }
            keys={['Point', 'Spot', 'Ambient', 'Directional']}
            values={['point', 'spot', 'ambient', 'directional']}
            onChange={this.handleChange.bind(this, 'type')}
          />
        </Field>
        {(entity.light.type === 'point' ||
          entity.light.type === 'spot'
        ) && (
          <Field field='Position'>
            <Vec3Input value={ entity.light.position }
              onChange={this.handleChange.bind(this, 'position')}
            />
          </Field>
        )}
        {(entity.light.type === 'spot' ||
          entity.light.type === 'directional'
        ) && (
          <Field field='Direction'>
            <Vec3Input value={ entity.light.direction }
              onChange={this.handleChange.bind(this, 'direction')}
            />
          </Field>
        )}
        {entity.light.type === 'spot' && (
          <Field field='Angle'>
            <Vec2Input value={ entity.light.angle }
              onChange={this.handleChange.bind(this, 'angle')}
            />
          </Field>
        )}
        {(entity.light.type === 'point' ||
          entity.light.type === 'spot'
        ) && (
          <Field field='Attenuat'>
            <NumberInput value={ entity.light.attenuation }
              onChange={this.handleChange.bind(this, 'attenuation')}
            />
          </Field>
        )}
        <Field field='Ambient'>
          <ColorVec3Input value={ entity.light.ambient }
            onChange={this.handleChange.bind(this, 'ambient')}
          />
        </Field>
        <Field field='Diffuse'>
          <ColorVec3Input value={ entity.light.diffuse }
            onChange={this.handleChange.bind(this, 'diffuse')}
          />
        </Field>
        <Field field='Specular'>
          <ColorVec3Input value={ entity.light.specular }
            onChange={this.handleChange.bind(this, 'specular')}
          />
        </Field>
      </Panel>
    );
  }
}

LightPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
