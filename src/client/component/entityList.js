import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class EntityList extends Component {
  render() {
    const { entities, selected, onSelect = () => {} } = this.props;
    return (
      <div className='entity-list'>
        <div className='header'>
          <div className='left'>
            { `${entities.length} Entities` }
          </div>
        </div>
        <ul className='content'>
          {
            entities.map((e, id) => (
              <li key={id}
                className={classNames({selected: selected === id})}
                onClick={onSelect.bind(null, id)}
              >
                <span className='id'>
                  {id}
                </span>
                <span className='name'>
                  {e.name}
                </span>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

EntityList.propTypes = {
  entities: PropTypes.array,
  onSelect: PropTypes.func,
  selected: PropTypes.number
};
