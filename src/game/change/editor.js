import createChange from 'ecsalator/lib/util/createChange';

export const SELECT_ENTITY = 'editor/selectEntity';

export const selectEntity = createChange(SELECT_ENTITY, entity => ({
  entity
}));
