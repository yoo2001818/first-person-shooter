import createChange from 'ecsalator/lib/util/createChange';

export const ADD = 'velocity/add';
export const SET = 'velocity/set';

export const add = createChange(ADD, (entity, vec) => ({
  entity, vec
}));
export const set = createChange(SET, (entity, vec) => ({
  entity, vec
}));
