import { type ReactNode } from 'react';
import type { StandaloneAppConfig } from '../../types';
import { StandaloneProvider } from '../standalone-provider';
import { App } from '../app';

export function ShowcaseApp(props: StandaloneAppConfig): ReactNode {
  return (
    <StandaloneProvider {...props}>
      <App />
    </StandaloneProvider>
  );
}
