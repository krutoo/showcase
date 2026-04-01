import { useContext, useEffect } from 'react';
import { useLatestRef, useMatchMedia, useStorageItem } from '@krutoo/utils/react';
import { ShowcaseContext } from '../../context/showcase';

export function useColorSchemeState({ classes }: { classes: Record<string, string | undefined> }): {
  colorScheme: 'dark' | 'light';
  toggleColorScheme: VoidFunction;
} {
  const { config } = useContext(ShowcaseContext);

  const isDefaultDark = useMatchMedia('(prefers-color-scheme: dark)');
  const defaultScheme = config.colorSchemes.enabled && isDefaultDark ? 'dark' : 'light';

  const [savedScheme, setSavedScheme] = useStorageItem('showcase:color-scheme', {
    storage: () => localStorage,
  });

  const scheme = savedScheme ?? defaultScheme;
  const classesRef = useLatestRef(classes);

  useEffect(() => {
    if (config.colorSchemes.attributeTarget !== 'documentElement') {
      return;
    }

    const className = classesRef.current![scheme] ?? '';

    if (scheme && config.colorSchemes.enabled) {
      document.documentElement.setAttribute('data-color-scheme', scheme);
      document.documentElement.classList.add(className);
    }

    return () => {
      document.documentElement.removeAttribute('data-color-scheme');
      document.documentElement.classList.remove(className);
    };
  }, [config.colorSchemes, scheme, classesRef]);

  return {
    colorScheme: scheme as 'light' | 'dark',
    toggleColorScheme: () => {
      setSavedScheme(scheme === 'dark' ? 'light' : 'dark');
    },
  };
}
