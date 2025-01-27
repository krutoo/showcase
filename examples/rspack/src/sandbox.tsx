import { createRoot } from 'react-dom/client';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { SandboxApp } from '@krutoo/showcase/runtime-sandbox';
import foundStories from '#found-stories';
import './reset.css';

const { validStories } = filterValidStories(foundStories);

createRoot(document.querySelector('#root')!).render(<SandboxApp stories={validStories} />);
