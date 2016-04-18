import React, { Component, PropTypes } from 'react';

export default class Field extends Component {
  render() {
    const { field, children } = this.props;
    return (
      <div className='field-component'>
        <span className='field'>
          <span className='field-table'>
            <span className='field-cell'>
              { field }
            </span>
          </span>
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
