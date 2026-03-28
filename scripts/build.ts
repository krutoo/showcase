import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import { promisify } from 'node:util';

const $ = promisify(exec);

// clean
await fs.rm('dist', { recursive: true, force: true });

// compile ts
await $('tsc -p tsconfig.build.json');

// add import extensions
await $('tsc-alias -p tsconfig.build.json');

// fix css imports
await $('npx babel dist --out-dir dist');

// build css
await $('rspack build');

// format (for reduce package size by replacing indent from 4 to 2)
await $('npx prettier "dist/**/*.js" -w --log-level=error --ignore-path=./.nonexistent');
