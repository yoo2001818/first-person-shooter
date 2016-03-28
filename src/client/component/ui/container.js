import React, { Component, PropTypes } from 'react';

export default class Container extends Component {
  render() {
    const { header, children } = this.props;
    return (
      <div className='container'>
        { header }
        <div className='content'>
          { children }
        </div>
      </div>
    );
  }
}

Container.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node
};
