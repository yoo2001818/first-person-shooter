import React, { Component, PropTypes } from 'react';
import * as GeomType from '../../game/util/geometryType';

export class Entity extends Component {
  render() {
    const { pos: { translate: t, scale: s, type }, render } = this.props.entity;
    const boundingBox = (
      <rect x={-Math.abs(s[0]) - 1} y={-Math.abs(s[1]) - 1}
        width={Math.abs(s[0]) * 2 + 2} height={Math.abs(s[1]) * 2 + 2}
        className='bounding-box'
        />
    );
    let shape;
    switch (type) {
    case GeomType.RECT:
      shape = (
        <rect x={-s[0] | 0} y={-s[1] | 0}
          width={s[0] * 2 | 0} height={s[1] * 2 | 0}
          fill='none' stroke={render.color}
          />
      );
      break;
    case GeomType.LINE:
    default:
      shape = (
        <line x1={-s[0] | 0} y1={-s[1] | 0}
          x2={s[0] | 0} y2={s[1] | 0}
          stroke={render.color}
          />
      );
      break;
    }
    return (
      <g transform={`translate(${t[0] | 0} ${t[1] | 0})`}>
        {this.props.selected && boundingBox}
        {shape}
      </g>
    );
  }
}

Entity.propTypes = {
  entity: PropTypes.object.isRequired,
  selected: PropTypes.bool
};

export default class Viewport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 800,
      height: 600
    };
  }
  validateSize() {
    const { clientWidth: width, clientHeight: height } = this.refs.container;
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({ width, height });
    }
  }
  componentDidMount() {
    this.validateSize();
    this.validateCallback = () => {
      setTimeout(() => this.validateSize(), 1);
    };
    window.addEventListener('resize', this.validateCallback);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.validateCallback);
  }
  componentWillMount() {
    const { store } = this.props;
    this.entities = store.systems.family.get(['pos', 'render']).entities;
    console.log(this.entities);
    console.log(store.state.entities);
  }
  componentWillReceiveProps(props) {
    const { store } = props;
    this.entities = store.systems.family.get(['pos', 'render']).entities;
  }
  render() {
    const { store } = this.props;
    const { width, height } = this.state;
    const viewX = (-width / 2 | 0) + 0.5;
    const viewY = (-height / 2 | 0) + 0.5;
    return (
      <div className='viewport-component' ref='container'>
        <svg className='viewport-canvas'
          width={width} height={height}
          viewBox={`${viewX} ${viewY} ${width} ${height}`}
        >
          {this.entities.map(entity => (
            <Entity entity={entity} key={entity.id}
              selected={entity.id === store.state.globals.editor.selectedEntity}
              />
          ))}
        </svg>
      </div>
    );
  }
}

Viewport.propTypes = {
  store: PropTypes.object
};
