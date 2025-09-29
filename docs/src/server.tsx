import fs from 'node:fs/promises';
import path from 'node:path';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { BrowserRouter } from '@krutoo/showcase/runtime-showcase';
import { App } from '#components/app/app';
import { Helmet } from '#components/helmet/helmet';
import foundStories from '#found-stories';
import { withPublicPath } from './utils';
import './reset.css';
import './showcase.css';

const { validStories } = filterValidStories(foundStories);

for (const item of validStories) {
  const outputPath = path.join(import.meta.env.TEMPLATES_DIR, `.${item.pathname}.html`);

  const router = new BrowserRouter({
    defaultLocation: {
      pathname: withPublicPath(`.${item.pathname}`),
      search: '',
      hash: '',
    },
  });

  const markup = `<!doctype html>${renderToString(
    <Helmet>
      <div id='root'>
        <App router={router} />
      </div>
    </Helmet>,
  )}`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, markup);
}

// also emit default template with empty root
const outputPath = path.join(import.meta.env.TEMPLATES_DIR, `./_default.html`);

const markup = `<!doctype html>${renderToStaticMarkup(
  <Helmet>
    <div id='root'></div>
  </Helmet>,
)}`;

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, markup);
