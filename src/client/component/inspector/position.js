import React, { Component, PropTypes } from 'react';

import * as posChanges from '../../../game/change/pos';

import Panel from './panel';
import Field from '../ui/field';
import SelectInput from '../ui/selectInput';
import VectorInput from '../ui/vectorInput';

export default class PositionPanel extends Component {
  handleTranslate(event) {
    if (!this.props.onEdit) return;
    this.props.onEdit(posChanges.setPos(this.props.entity, event.target.value));
  }
  handleScale(event) {
    const { onEdit, entity } = this.props;
    if (!onEdit) return;
    onEdit(posChanges.set(entity,
      entity.pos.translate, event.target.value, entity.pos.type));
  }
  handleType(event) {
    const { onEdit, entity } = this.props;
    if (!onEdit) return;
    onEdit(posChanges.set(entity,
      entity.pos.translate, entity.pos.scale, event.target.value));
  }
  render() {
    const { entity } = this.props;
    return (
      <Panel header='Position'>
        <Field field='Type'>
          <SelectInput value={ entity.pos.type }
            onSelect={this.handleType.bind(this)}
            keys={['Rectangle', 'Line', 'Point', 'Circle']}
            values={[1, 2, 4, 8]}
          />
        </Field>
        <Field field='Translate'>
          <VectorInput value={ entity.pos.translate }
            onChange={this.handleTranslate.bind(this)}
          />
        </Field>
        <Field field='Scale'>
          <VectorInput value={ entity.pos.scale }
            onChange={this.handleScale.bind(this)}
          />
        </Field>
        {/*
        <Field field='Rotation'>
          <NumberInput vector={ entity.pos.rotation } />
        </Field>
        */}
      </Panel>
    );
  }
}

PositionPanel.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
