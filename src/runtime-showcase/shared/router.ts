export interface RouterLocation {
  pathname: string;
  hash: string;
  search: string;
}

export interface Router {
  /** Get current location. */
  getLocation(): RouterLocation;

  /** Navigate to other route. */
  navigate(url: string): void;

  /** Connect to window (start working). */
  connect(): () => void;

  /** Subscribe to location change. */
  subscribe(handler: VoidFunction): () => void;
}

export function getStubLocation(): RouterLocation {
  return {
    pathname: '/',
    hash: '',
    search: '',
  };
}

export class BrowserRouter implements Router {
  private location: RouterLocation;
  private listeners: Set<VoidFunction>;

  constructor({ defaultLocation }: { defaultLocation?: RouterLocation } = {}) {
    this.location = defaultLocation ?? getStubLocation();
    this.listeners = new Set();
  }

  private setLocation(location: RouterLocation): void {
    this.location = location;

    for (const listener of this.listeners) {
      listener();
    }
  }

  getLocation(): RouterLocation {
    return this.location;
  }

  navigate(url: string): void {
    const currentUrl = new URL(window.location.href);
    const nextUrl = new URL(url, window.location.href);

    if (nextUrl.host !== currentUrl.host) {
      window.location.assign(nextUrl.href);
      return;
    }

    window.history.pushState(null, '', `${nextUrl.pathname}${nextUrl.search}`);
    window.scrollTo(0, 0);
    this.setLocation(nextUrl);
  }

  connect(): () => void {
    const sync = () => {
      const url = new URL(window.location.href);

      this.setLocation({
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      });
    };

    sync();

    window.addEventListener('popstate', sync);

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

// @todo MemoryRouter если хочется совсем убрать роутинг
// @todo HashRouter если хочется на хешах
