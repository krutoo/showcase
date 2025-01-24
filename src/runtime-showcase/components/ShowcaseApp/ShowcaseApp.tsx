import { App } from '../App';
import { StandaloneAppProps, StandaloneProvider } from '../StandaloneProvider';

export type ShowcaseAppProps = StandaloneAppProps;

export function ShowcaseApp(props: StandaloneAppProps) {
  return (
    <StandaloneProvider {...props}>
      <App />
    </StandaloneProvider>
  );
}
