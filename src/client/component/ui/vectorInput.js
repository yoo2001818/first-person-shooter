import React, { Component, PropTypes } from 'react';

export default class VectorInput extends Component {
  render() {
    const { vector } = this.props;
    return (
      <div className='vector-input-component'>
        <input type='number' value={ vector[0] } />
        <input type='number' value={ vector[1] } />
      </div>
    );
  }
}

VectorInput.propTypes = {
  vector: PropTypes.any
};
