import React, { Component, PropTypes } from 'react';

import OverviewPanel from './inspector/overview';
import inspectors from './inspector';

import Panel from './inspector/panel';

export default class EntityInspector extends Component {
  render() {
    const { entity, onEdit = () => {} } = this.props;
    return (
      <div className='entity-inspector'>
        <OverviewPanel entity={entity} onEdit={onEdit} />
        { Object.keys(entity).map(key => {
          if (inspectors[key] == null) return null;
          let KeyPanel = inspectors[key];
          return (
            <KeyPanel entity={entity} onEdit={onEdit} key={key} />
          );
        }).filter(a => a != null) }
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
