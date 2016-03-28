import React, { Component, PropTypes } from 'react';

export default class EntityList extends Component {
  render() {
    const { entities } = this.props;
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
              <li key={id}>
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
  entities: PropTypes.array
};
