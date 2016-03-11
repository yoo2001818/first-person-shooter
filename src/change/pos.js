import createChange from 'ecsalator/lib/util/createChange';

// This should be 3-dimensional at the end, however I don't really
// understand vectors and stuff - I'll try it after making 3D renderer.

export const ADD = 'pos/addPos';
export const SET = 'pos/setPos';

export const add = createChange(ADD, (entity, x, y) => ({
  entity, x, y
}));
export const set = createChange(SET, (entity, x, y, _, write = true) => ({
  entity, x, y, write
}));
