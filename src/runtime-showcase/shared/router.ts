import { Context, createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface RouterLocation {
  readonly pathname: string;
}

export interface Router {
  getLocation(): RouterLocation;
  navigate(pathname: string): void;
  connect(): () => void;
  subscribe(handler: VoidFunction): () => void;
}

export class QueryRouter implements Router {
  private location: RouterLocation;
  private listeners: Set<VoidFunction>;

  constructor() {
    this.location = { pathname: '' };
    this.listeners = new Set();
  }

  private updateLocation(pathname: string): void {
    this.location = { pathname };
    this.listeners.forEach(fn => fn());
  }

  getLocation(): RouterLocation {
    return this.location;
  }

  navigate(pathname: string): void {
    const url = new URL(window.location.href);

    url.searchParams.delete('path');

    window.history.pushState(
      null,
      '',
      `${url.pathname}${url.search}${pathname ? `${url.search ? '&' : '?'}path=${pathname}` : ''}`,
    );

    window.scrollTo(0, 0);

    this.updateLocation(pathname);
  }

  connect(): () => void {
    const sync = () => {
      // @todo проверить event.target тк iframe на странице тоже вызывает событие на родителе
      this.updateLocation(new URL(window.location.href).searchParams.get('path') ?? '');
    };

    window.addEventListener('popstate', sync);

    sync();

    return () => {
      window.removeEventListener('popstate', sync);
    };
  }

  subscribe(listener: VoidFunction): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const RouterContext: Context<Router> = createContext<Router>({
  getLocation: () => ({ pathname: '' }),
  navigate: () => {},
  subscribe: () => () => {},
  connect: () => () => {},
});

RouterContext.displayName = 'RouterContext';

export function useNavigate(): Router['navigate'] {
  const router = useContext(RouterContext);

  return useCallback<Router['navigate']>(pathname => router.navigate(pathname), [router]);
}

export function useLocation(): RouterLocation {
  const router = useContext(RouterContext);

  const [location, setLocation] = useState<RouterLocation>(() => ({ pathname: '' }));

  useEffect(() => {
    const sync = () => {
      setLocation(router.getLocation());
    };

    sync();

    return router.subscribe(sync);
  }, [router]);

  return location;
}
