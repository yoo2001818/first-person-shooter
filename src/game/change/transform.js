import createChange from 'ecsalator/lib/util/createChange';

export const SET = 'transform/set';

export const SET_POSITION = 'transform/setPosition';
export const SET_ROTATION = 'transform/setRotation';
export const SET_SCALE = 'transform/setScale';

export const ADD_POSITION = 'transform/addPosition';
export const ADD_ROTATION = 'transform/addRotation';

export const set = createChange(SET, (entity, props) => ({
  entity, props
}));

export const setPosition = createChange(SET_POSITION, (entity, vec) => ({
  entity, vec
}));
export const setRotation = createChange(SET_ROTATION, (entity, quat) => ({
  entity, quat
}));
export const setScale = createChange(SET_SCALE, (entity, vec) => ({
  entity, vec
}));

export const addPosition = createChange(ADD_POSITION, (entity, vec) => ({
  entity, vec
}));
export const addRotation = createChange(ADD_ROTATION, (entity, quat) => ({
  entity, quat
}));
