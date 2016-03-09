// Action logger; However this doesn't log changes since that would be too
// costful.

export default function logger(store) {
  return next => action => {
    console.log('%c%s%c %s', 'font-weight: bold; color: #39A63A',
      action.type, '', new Date().toTimeString());
    console.log('%c  payload: %o', 'color: #000', action.payload);
    console.log('%c  meta: %o', 'color: #000', action.meta);
    next(action);
  };
}
