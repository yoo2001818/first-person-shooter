import React, { Component, PropTypes } from 'react';

export default class Header extends Component {
  render() {
    const { title, right } = this.props;
    return (
      <div className='header-component'>
        <div className='content'>
          <div className='left'>
            <h1 className='title'>
              { title }
            </h1>
          </div>
          <div className='center'>

          </div>
          <div className='right'>
            { right }
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  title: PropTypes.node,
  right: PropTypes.node
};
