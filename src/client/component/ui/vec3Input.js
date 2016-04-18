import React, { Component, PropTypes } from 'react';
import { vec3 as Vec3 } from 'gl-matrix';

import NumberInput from './numberInput';

export default class Vec3Input extends Component {
  handleChange(pos, e) {
    let vec = Vec3.create();
    if (this.props.value) Vec3.copy(vec, this.props.value);
    vec[pos] = parseFloat(e.target.value);
    if (this.props.onChange) {
      this.props.onChange({
        target: {
          value: vec
        }
      });
    }
  }
  render() {
    const { value } = this.props;
    return (
      <div className='vec3-input-component'>
        <NumberInput value={ value && value[0].toFixed(3) }
          onChange={this.handleChange.bind(this, 0)}
        />
        <NumberInput value={ value && value[1].toFixed(3) }
          onChange={this.handleChange.bind(this, 1)}
        />
        <NumberInput value={ value && value[2].toFixed(3) }
          onChange={this.handleChange.bind(this, 2)}
        />
      </div>
    );
  }
}

Vec3Input.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func
};
