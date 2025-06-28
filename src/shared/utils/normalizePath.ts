export function normalizePath(path: string): string {
  if (!path.startsWith('/')) {
    return '/' + path;
  }

  return path;
}
