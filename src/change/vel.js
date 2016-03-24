import createChange from 'ecsalator/lib/util/createChange';

export const ADD = 'vel/addPos';
export const SET = 'vel/setPos';

export const add = createChange(ADD, (entity, vec) => ({
  entity, vec
}));
export const set = createChange(SET, (entity, vec) => ({
  entity, vec
}));
