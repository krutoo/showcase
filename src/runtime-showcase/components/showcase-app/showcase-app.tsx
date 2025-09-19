import { type ReactNode } from 'react';
import { App } from '../app';
import { type StandaloneAppProps, StandaloneProvider } from '../standalone-provider';

export type ShowcaseAppProps = StandaloneAppProps;

export function ShowcaseApp(props: StandaloneAppProps): ReactNode {
  return (
    <StandaloneProvider {...props}>
      <App />
    </StandaloneProvider>
  );
}
