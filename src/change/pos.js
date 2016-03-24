import createChange from 'ecsalator/lib/util/createChange';

// This should be 3-dimensional at the end, however I don't really
// understand vectors and stuff - I'll try it after making 3D renderer.

export const TRANSLATE = 'pos/translate';
export const SET_POS = 'pos/setPos';
export const SET = 'pos/set';

export const translate = createChange(TRANSLATE, (entity, vec) => ({
  entity, vec
}));
export const setPos = createChange(SET_POS, (entity, x, y) => ({
  entity, x, y
}));
export const set = createChange(SET, (entity, translate, scale, type) => ({
  entity, translate, scale, type
}));
