import fs from 'node:fs';
import path from 'node:path';

export async function loadProjectFiles(
  dir: string = path.resolve(__dirname, '../../application'),
) {
  const extensions = ['.ts', '.js']; // Use .js se estiver buildado

  function readRecursively(currentPath: string) {
    const files: string[] = [];

    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        files.push(...readRecursively(fullPath));
      } else if (extensions.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const allFiles = readRecursively(dir);

  for (const filePath of allFiles) {
    if (filePath.match(/\.(spec|test|mock)\./) || filePath.endsWith('.d.ts')) {
      continue;
    }

    const normalized = path.resolve(filePath);
    await import(normalized);
  }
}
