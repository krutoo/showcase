declare module '*.css';

declare module '#found-stories' {
  const stories: unknown[];
  export default stories;
}

interface ImportMetaEnv {
  [key: string]: any;
  NODE_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
