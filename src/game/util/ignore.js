export default function ignore(change) {
  // Maybe it's a bad idea to create copy like this?
  return Object.assign({}, change, {
    ignore: true
  });
}
