import { type ReactNode } from 'react';
import { App } from '../App';
import { type StandaloneAppProps, StandaloneProvider } from '../StandaloneProvider';

export type ShowcaseAppProps = StandaloneAppProps;

export function ShowcaseApp(props: StandaloneAppProps): ReactNode {
  return (
    <StandaloneProvider {...props}>
      <App />
    </StandaloneProvider>
  );
}
