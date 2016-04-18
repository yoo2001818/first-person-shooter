import React, { Component, PropTypes } from 'react';
import { vec2 as Vec2 } from 'gl-matrix';

import NumberInput from './numberInput';

export default class VectorInput extends Component {
  handleChange(pos, e) {
    let vec = Vec2.create();
    if (this.props.value) Vec2.copy(vec, this.props.value);
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
      <div className='vector-input-component'>
        <NumberInput value={ value && value[0].toFixed(3) }
          onChange={this.handleChange.bind(this, 0)}
        />
        <NumberInput value={ value && value[1].toFixed(3) }
          onChange={this.handleChange.bind(this, 1)}
        />
      </div>
    );
  }
}

VectorInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func
};
