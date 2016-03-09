// This class manages the components used by controller, etc.
export const components = [];

export default function register(name) {
  if (components.indexOf(name) !== -1) return;
  components.push(name);
}
