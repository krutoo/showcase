import { createContext, useCallback, useContext, useEffect, useState, type Context } from 'react';
import { type Router, type RouterLocation, getStubLocation } from './router';

export const RouterContext: Context<Router> = createContext<Router>({
  getLocation: getStubLocation,
  navigate: () => {},
  subscribe: () => () => {},
  connect: () => () => {},
});

RouterContext.displayName = 'RouterContext';

export function useNavigate(): Router['navigate'] {
  const router = useContext(RouterContext);

  return useCallback<Router['navigate']>(url => router.navigate(url), [router]);
}

export function useLocation(): RouterLocation {
  const router = useContext(RouterContext);
  const [location, setLocation] = useState<RouterLocation>(() => router.getLocation());

  useEffect(() => {
    const sync = () => {
      setLocation(router.getLocation());
    };

    sync();

    return router.subscribe(sync);
  }, [router]);

  return location;
}
