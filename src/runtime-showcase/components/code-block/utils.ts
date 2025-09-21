import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs';
import themeGitHubLight from 'shiki/themes/github-light.mjs';
import themeOneDarkPro from 'shiki/themes/one-dark-pro.mjs';

const defaultThemes = {
  light: {
    name: 'github-light',
    theme: themeGitHubLight,
  },
  dark: {
    name: 'one-dark-pro',
    theme: themeOneDarkPro,
  },
};

export function getHighlighterCore() {
  return createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: [
      // default langs:
      import('shiki/langs/mdx.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/scss.mjs'),
    ],
    themes: [
      // default themes:
      defaultThemes.light.theme,
      defaultThemes.dark.theme,
    ],
  });
}

export function getProcessedLang(lang: string): string {
  switch (lang) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'tsx';

    case 'css':
    case 'scss':
      return 'scss';

    default:
      return lang;
  }
}

export function getDefaultTheme(dark?: boolean): string {
  if (dark) {
    return defaultThemes.dark.name;
  }

  return defaultThemes.light.name;
}
