import fs from 'node:fs';
import path from 'node:path';

export default function addJsExtToCssModulesImports() {
  return {
    visitor: {
      ImportOrExportDeclaration: {
        enter(nodePath, { file }) {
          if (!file.opts.filename) {
            return;
          }

          if (nodePath.node.type === 'ExportDefaultDeclaration') {
            return;
          }

          if (!nodePath.node.source) {
            return;
          }

          if (
            !nodePath.node.source.value.startsWith('.') &&
            !nodePath.node.source.value.startsWith('/')
          ) {
            return;
          }

          if (!nodePath.node.source.value.endsWith('.m.css')) {
            return;
          }

          nodePath.node.source.value = `${nodePath.node.source.value}.js`;
        },
      },
    },
  };
}
