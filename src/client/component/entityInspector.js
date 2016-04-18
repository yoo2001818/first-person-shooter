import React, { Component, PropTypes } from 'react';

import OverviewPanel from './inspector/overview';
import DefaultFallbackPanel from './inspector/defaultFallback';
import inspectors from './inspector';

import Panel from './inspector/panel';

export default class EntityInspector extends Component {
  render() {
    const { entity, onEdit = () => {} } = this.props;
    return (
      <div className='entity-inspector'>
        <OverviewPanel entity={entity} onEdit={onEdit} />
        { Object.keys(entity).map(key => {
          let KeyPanel = inspectors[key];
          if (KeyPanel === undefined) KeyPanel = DefaultFallbackPanel;
          if (KeyPanel == null) return false;
          return (
            <KeyPanel entity={entity} onEdit={onEdit} key={key} name={key} />
          );
        }) }
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
