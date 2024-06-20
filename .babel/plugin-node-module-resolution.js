import fs from 'node:fs';
import path from 'node:path';

// @todo наивная реализация замены импортов node module resolution на конкретные
// вероятно не учитывает какие-то кейсы
export default function addJsExtToCssModules() {
  return {
    visitor: {
      ImportOrExportDeclaration: {
        enter(nodePath, { file }) {
          // нет информации о файле - пропускаем
          if (!file.opts.filename) {
            return;
          }

          // у ExportDefaultDeclaration не может быть source - пропускаем
          if (nodePath.node.type === 'ExportDefaultDeclaration') {
            return;
          }

          // если нет source - пропускаем
          if (!nodePath.node.source) {
            return;
          }

          // если это не относительный и не абсолютный путь - пропускаем
          if (
            !nodePath.node.source.value.startsWith('.') &&
            !nodePath.node.source.value.startsWith('/')
          ) {
            return;
          }

          // если это не импорт css-модуля - пропускаем
          if (!nodePath.node.source.value.endsWith('.m.css')) {
            return;
          }

          nodePath.node.source.value = `${nodePath.node.source.value}.js`;
        },
      },
    },
  };
}
