export function getDefault<T>(module: T & { default?: T }): T {
  return module.default || module;
}
