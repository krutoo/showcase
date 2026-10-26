import { type HTMLAttributes, type ReactNode, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { type HighlighterCore } from 'shiki/core';
import { ColorSchemesContext } from '../../../../runtime-showcase';
import { getDefaultTheme, getHighlighterCore, getProcessedLang } from './utils';
import styles from './code-block.m.css';

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  lang?: string;
}

interface SingletonPool {
  highlighter: null | HighlighterCore;
}

const singletons: SingletonPool = {
  highlighter: null,
};

export function CodeBlock({ lang, children, className, ...restProps }: CodeBlockProps): ReactNode {
  const { colorScheme } = useContext(ColorSchemesContext);
  const highlighter = useHighlighter();
  const [parsed, setParsed] = useState<string | null>(null);

  useEffect(() => {
    if (!highlighter) {
      return;
    }

    if (typeof children !== 'string') {
      return;
    }

    try {
      const html = highlighter.codeToHtml(children, {
        lang: getProcessedLang(lang ?? 'text'),
        theme: getDefaultTheme(colorScheme === 'dark'),
      });

      setParsed(html);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [children, lang, highlighter, colorScheme]);

  const props: HTMLAttributes<HTMLDivElement> = {
    className: classNames(styles.root, className),
    ...restProps,
  };

  if (parsed) {
    props.dangerouslySetInnerHTML = { __html: parsed };
  } else {
    props.children = <pre>{children}</pre>;
  }

  return <div {...props} />;
}

function useHighlighter(): HighlighterCore | null {
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null);

  useEffect(() => {
    let mount = true;

    if (singletons.highlighter) {
      setHighlighter(singletons.highlighter);
      return;
    }

    getHighlighterCore()
      .then(result => {
        if (!mount) {
          return;
        }

        singletons.highlighter = result;
        setHighlighter(result);
      })
      // eslint-disable-next-line no-console
      .catch(console.error);

    return () => {
      mount = false;
    };
  }, []);

  return highlighter;
}
