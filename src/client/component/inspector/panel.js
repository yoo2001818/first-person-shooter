import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Panel extends Component {
  render() {
    const { className, header, children } = this.props;
    return (
      <div className={classNames('panel', className)}>
        { header && (
          <div className='header'>
            { header }
          </div>
        )}
        <div className='content'>
          { children }
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  className: PropTypes.string,
  header: PropTypes.node,
  children: PropTypes.node
};
