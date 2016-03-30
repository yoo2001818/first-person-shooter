import React, { Component, PropTypes } from 'react';
import { Vector } from 'kollision';

import NumberInput from './numberInput';

export default class VectorInput extends Component {
  handleChange(pos, e) {
    let vec = Vector.create(0, 0);
    Vector.copy(this.props.value, vec);
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
        <NumberInput value={ value[0].toFixed(3) }
          onChange={this.handleChange.bind(this, 0)}
        />
        <NumberInput value={ value[1].toFixed(3) }
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
