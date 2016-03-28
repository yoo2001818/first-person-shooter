import React, { Component, PropTypes, Children, cloneElement } from 'react';
import classNames from 'classnames';

export class TabPanel extends Component {
  render() {
    const { children, selected } = this.props;
    return (
      <div className={classNames('tab-panel', { selected })}>
        { children }
      </div>
    );
  }
}

TabPanel.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  selected: PropTypes.bool
};

export default class TabBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
  }
  handleChange(index) {
    this.setState({
      selected: index
    });
  }
  render() {
    const { children } = this.props;
    const { selected } = this.state;
    return (
      <div className='tab-box-component'>
        <li className='tab-list'>
          { Children.map(children, (element, id) => (
            <ul
              className={classNames('tab-entry',
                { selected: id === selected }
              )}
              onClick={this.handleChange.bind(this, id)}
            >
              { element.props.title }
            </ul>
          ))}
        </li>
        { Children.map(children, (element, id) => (
            cloneElement(element, {
              selected: id === selected
            })
          )
        )}
      </div>
    );
  }
}

TabBox.propTypes = {
  children: PropTypes.node
};
