import createChange from 'ecsalator/lib/util/createChange';

export const SET = 'geom/set';

export const set = createChange(SET, (entity, data, write = true) => ({
  entity, data, write
}));
