import React, { Component, PropTypes } from 'react';

export default class EntityList extends Component {
  render() {
    const { entities } = this.props;
    return (
      <ul className='entity-list'>
        {
          entities.map((e, id) => (
            <li key={id}>
              #{id} {e.name}
            </li>
          ))
        }
      </ul>
    );
  }
}

EntityList.propTypes = {
  entities: PropTypes.array
};
