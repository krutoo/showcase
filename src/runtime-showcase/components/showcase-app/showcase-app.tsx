import { type ReactNode } from 'react';
import type { StandaloneAppConfig } from '../../types';
import { App } from '../app';
import { StandaloneProvider } from '../standalone-provider';

export function ShowcaseApp(props: StandaloneAppConfig): ReactNode {
  return (
    <StandaloneProvider {...props}>
      <App />
    </StandaloneProvider>
  );
}
