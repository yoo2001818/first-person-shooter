import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Field from './ui/field';
import DropDown from './ui/dropDown';

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
                <div>Rectangle잘깨진다</div>
              </DropDown>
            </Field>
            <Field field='Translate'>Data</Field>
            <Field field='Scale'>Data</Field>
            <Field field='Rotation'>Data</Field>
          </Panel>
        )}
        { entity.vel && (
          <Panel header='Velocity'>
            <Field field='Velocity'>Data</Field>
          </Panel>
        )}
        { entity.cursor && (
          <Panel header='Follow Cursor'>
          </Panel>
        )}
        <Panel header='JSON representation'>
          { JSON.stringify(entity) }
        </Panel>
        <Panel header='Title'>
          ...
        </Panel>
      </div>
    );
  }
}

EntityInspector.propTypes = {
  entity: PropTypes.object
};
