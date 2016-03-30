import React, { Component, PropTypes } from 'react';

export default class NumberInput extends Component {
  render() {
    const { value } = this.props;
    return (
      <div className='number-input-component'>
        <input type='number' value={ value } />
      </div>
    );
  }
}

NumberInput.propTypes = {
  value: PropTypes.number
};
