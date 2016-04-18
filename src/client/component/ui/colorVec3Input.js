import React, { Component, PropTypes } from 'react';
import { vecToString, stringToVec } from '../../../game/util/color';

import Vec3Input from './vec3Input';

export default class ColorVec3Input extends Component {
  handleColor(e) {
    this.handleVector({
      target: {
        value: stringToVec(e.target.value)
      }
    });
  }
  handleVector(e) {
    if (this.props.onChange) {
      this.props.onChange({
        target: {
          value: e.target.value
        }
      });
    }
  }
  render() {
    const { value } = this.props;
    return (
      <div className='color-vec3-input-component'>
        <input type='color' className='color-input-component'
          value={ vecToString(value) }
          onChange={this.handleColor.bind(this)}
        />
        <Vec3Input value={ value }
          onChange={this.handleVector.bind(this)}
        />
      </div>
    );
  }
}

ColorVec3Input.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func
};
