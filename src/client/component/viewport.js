import React, { Component, PropTypes } from 'react';
import * as GeomType from '../../game/util/geometryType';

export class Entity extends Component {
  render() {
    const { pos: { translate: t, scale: s, type }, render } = this.props.entity;
    /* const boundingBox = (
      <rect x={-s[0] - 0.5} y={-s[1] - 0.5}
        width={s[0] * 2 + 1} height={s[1] * 2 + 1}
        fill='none' stroke='#006FFF'
        className='bounding-box'
        />
    ); */
    let shape;
    switch (type) {
    case GeomType.RECT:
      shape = (
        <rect x={-s[0]} y={-s[1]}
          width={s[0] * 2} height={s[1] * 2}
          fill='none' stroke={render.color}
          />
      );
      break;
    case GeomType.LINE:
    default:
      shape = (
        <line x1={-s[0]} y1={-s[1]}
          x2={s[0]} y2={s[1]}
          stroke={render.color}
          />
      );
      break;
    }
    return (
      <g transform={`translate(${t[0]} ${t[1]})`}>
        {shape}
      </g>
    );
  }
}

Entity.propTypes = {
  entity: PropTypes.object.isRequired
};

export default class Viewport extends Component {
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
    return (
      <svg className='viewport-component'
        width="800" height="600" viewBox="-400 -300 800 600"
      >
        {this.entities.map(entity => (
          <Entity entity={entity} key={entity.id} />
        ))}
      </svg>
    );
  }
}

Viewport.propTypes = {
  store: PropTypes.object
};
