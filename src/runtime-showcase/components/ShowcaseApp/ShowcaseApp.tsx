import { ReactNode } from 'react';
import { App } from '../App';
import { StandaloneAppProps, StandaloneProvider } from '../StandaloneProvider';

export type ShowcaseAppProps = StandaloneAppProps;

export function ShowcaseApp(props: StandaloneAppProps): ReactNode {
  return (
    <StandaloneProvider {...props}>
      <App />
    </StandaloneProvider>
  );
}
