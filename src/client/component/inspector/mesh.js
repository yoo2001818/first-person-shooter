import React, { Component, PropTypes } from 'react';

import * as ECSChanges from 'ecsalator/lib/ecs/changes';

import Panel from './panel';
import Field from '../ui/field';

export default class MeshPanel extends Component {
  handleChange(key, event) {
    const { onEdit, entity } = this.props;
    if (!onEdit) return;
    onEdit(ECSChanges.set(entity, 'mesh', Object.assign({}, entity.mesh, {
      [key]: event.target.value
    })));
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel header='Mesh'>
        <Field field='Geometry'>
          <input className='input string-input'
            value={ entity.mesh.geometry }
            onChange={ this.handleChange.bind(this, 'geometry')}
          />
        </Field>
        <Field field='Material'>
          <input className='input string-input'
            value={ entity.mesh.material }
            onChange={ this.handleChange.bind(this, 'material')}
          />
        </Field>
      </Panel>
    );
  }
}

MeshPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
