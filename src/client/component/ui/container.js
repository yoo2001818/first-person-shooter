import React, { Component, PropTypes } from 'react';

export default class Container extends Component {
  render() {
    const { header, footer, children } = this.props;
    return (
      <div className='container'>
        { header }
        <div className='content'>
          { children }
        </div>
        { footer }
      </div>
    );
  }
}

Container.propTypes = {
  header: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node
};
