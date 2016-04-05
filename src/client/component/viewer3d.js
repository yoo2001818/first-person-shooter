import React, { Component, PropTypes } from 'react';

import RenderView from '../view/render3d';

export default class Viewer3D extends Component {
  validateSize() {
    const { clientWidth: width, clientHeight: height } = this.refs.container;
    if (this.width !== width || this.height !== height) {
      this.refs.canvas.width = width | 0;
      this.refs.canvas.height = height | 0;
      this.width = width;
      this.height = height;
      if (this.renderView) {
        this.renderView.resize();
      }
    }
  }
  animate() {
    this.renderView.render(Date.now() - this.lastTime);
    this.lastTime = Date.now();
    window.requestAnimationFrame(this.animate.bind(this));
  }
  initView() {
    this.lastTime = Date.now();
    this.renderView = new RenderView(this.props.store, this.refs.canvas);
    this.renderView.setupEvents();
    this.renderView.init();
    this.renderView.render(0);
  }
  componentDidUpdate() {
    this.renderView.render(0);
  }
  componentDidMount() {
    // Mount
    this.validateSize();
    this.validateCallback = () => {
      setTimeout(() => this.validateSize(), 1);
    };
    window.addEventListener('resize', this.validateCallback);
    this.initView();
    window.requestAnimationFrame(this.animate.bind(this));
    this.mounted = true;
  }
  componentWillUnmount() {
    // Unmount cleanup
    this.renderView.clearEvents();
    window.removeEventListener('resize', this.validateCallback);
    this.mounted = false;
  }
  shouldComponentUpdate() {
    // it should never update since it doesn't use React at all.
    return false;
  }
  render() {
    return (
      <div className='viewer3d-component' ref='container'>
        <canvas ref='canvas' />
      </div>
    );
  }
}

Viewer3D.propTypes = {
  store: PropTypes.object
};
