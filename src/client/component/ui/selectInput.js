import React, { Component, PropTypes } from 'react';
import DropDown from './dropDown';

export default class SelectInput extends Component {
  handleSelect(id) {
    if (this.props.onChange) {
      this.props.onChange({
        target: {
          value: this.props.values[id]
        }
      });
    }
  }
  render() {
    const { value, values, keys } = this.props;
    return (
      <DropDown title={keys[values.indexOf(value)]}>
        <ul>
          { keys.map((e, id) => (
            <li key={id} onClick={this.handleSelect.bind(this, id)}>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </DropDown>
    );
  }
}

SelectInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  keys: PropTypes.array,
  values: PropTypes.array
};
