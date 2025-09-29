import { createRoot } from 'react-dom/client';
import { App } from '#components/app/app';
import './reset.css';
import './showcase.css';

createRoot(document.getElementById('root')!).render(<App />);
