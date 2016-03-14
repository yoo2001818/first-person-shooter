import createChange from 'ecsalator/lib/util/createChange';

export const ADD = 'vel/addPos';
export const SET = 'vel/setPos';

export const add = createChange(ADD, (entity, x, y) => ({
  entity, x, y
}));
export const set = createChange(SET, (entity, x, y, _, write = true) => ({
  entity, x, y, write
}));
