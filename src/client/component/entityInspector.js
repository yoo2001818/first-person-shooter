import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Field from './ui/field';
import DropDown from './ui/dropDown';
import VectorInput from './ui/vectorInput';

export class Panel extends Component {
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

export default class EntityInspector extends Component {
  render() {
    const { entity } = this.props;
    return (
      <div className='entity-inspector'>
        <Panel className='overview'>
          <span className='id'>
            { entity.id }
          </span>
          <span className='name'>
            <input type='text' value={ entity.name } />
          </span>
        </Panel>
        { entity.pos && (
          <Panel header='Position'>
            <Field field='Type'>
              <DropDown title='Rectangle'>
                <ul>
                  <li><span>Rectangle</span></li>
                  <li><span>Circle</span></li>
                  <li><span>Line</span></li>
                  <li><span>Point</span></li>
                </ul>
              </DropDown>
            </Field>
            <Field field='Translate'>
              <VectorInput vector={ entity.pos.translate } />
            </Field>
            <Field field='Scale'>
              <VectorInput vector={ entity.pos.scale } />
            </Field>
            {/*
            <Field field='Rotation'>
              <NumberInput vector={ entity.pos.rotation } />
            </Field>
            */}
          </Panel>
        )}
        { entity.vel && (
          <Panel header='Velocity'>
            <Field field='Velocity'>
              <VectorInput vector={ entity.vel } />
            </Field>
          </Panel>
        )}
        { entity.cursor && (
          <Panel header='Follow Cursor'>
          </Panel>
        )}
        { entity.collision && (
          <Panel header='Collision'>
          </Panel>
        )}
        { entity.render && (
          <Panel header='Render'>
            <Field field='Color'>
              <input type='color' className='input color-input'
                value={ entity.render.color }
              />
            </Field>
          </Panel>
        )}
        <Panel header='JSON representation'>
          <code><pre>
            { JSON.stringify(entity, (key, value) => {
              if (value instanceof Float32Array) {
                return Array.from(value);
              }
              return value;
            }, 2) }
          </pre></code>
        </Panel>
      </div>
    );
  }
}

EntityInspector.propTypes = {
  entity: PropTypes.object
};
