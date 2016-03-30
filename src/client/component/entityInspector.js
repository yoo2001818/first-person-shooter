import React, { Component, PropTypes } from 'react';

import inspectors from './inspector';

import Panel from './inspector/panel';
import Field from './ui/field';
import VectorInput from './ui/vectorInput';


export default class EntityInspector extends Component {
  render() {
    const { entity, onEdit = () => {} } = this.props;
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
        { Object.keys(entity).map(key => {
          if (inspectors[key] == null) return null;
          let KeyPanel = inspectors[key];
          return (
            <KeyPanel entity={entity} onEdit={onEdit} key={key} />
          );
        }).filter(a => a != null) }
        { entity.vel && (
          <Panel header='Velocity'>
            <Field field='Velocity'>
              <VectorInput value={ entity.vel } />
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
  entity: PropTypes.object,
  onEdit: PropTypes.func
};
