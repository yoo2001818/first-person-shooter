import React, { Component, PropTypes } from 'react';

export default class Field extends Component {
  render() {
    const { field, children } = this.props;
    return (
      <div className='field-component'>
        <span className='field'>
          { field }
        </span>
        <span className='content'>
          { children }
        </span>
      </div>
    );
  }
}

Field.propTypes = {
  field: PropTypes.node,
  children: PropTypes.node
};
