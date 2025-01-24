import {
  AnchorHTMLAttributes,
  createContext,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import { createMicroStore, MicroStore } from '../../shared/micro-store';
import { useIsomorphicLayoutEffect } from '@krutoo/utils/react';
import classNames from 'classnames';
import styles from './Menu.m.css';

export interface MenuProps<T> {
  depth?: number;
  items: T[];
  getTitle?: (item: T) => ReactNode;
  getHref?: (item: T) => string | undefined;
  getChildItems?: (item: T) => T[];
  isActive?: (item: T) => boolean;
  onItemClick?: (event: MouseEvent<HTMLElement>, data: T) => void;
}

interface MenuItemContextValue {
  store: MicroStore<{ open: boolean }>;
  controlled: boolean;
}

const MenuItemContext = createContext<MenuItemContextValue>({
  store: createMicroStore<{ open: boolean }>({ open: true }),
  controlled: false,
});

MenuItemContext.displayName = 'MenuItemContext';

export function Menu<T>({
  depth = 0,
  items,
  getTitle,
  getHref,
  isActive,
  onItemClick,
  getChildItems,
}: MenuProps<T>) {
  return (
    <>
      {items.map((item, index) => {
        const childItems = getChildItems?.(item) ?? [];
        const toplevel = depth === 0;

        return (
          <MenuItem
            key={index}
            open={toplevel ? true : undefined}
            defaultOpen={toplevel}
            active={isActive?.(item)}
          >
            <MenuItemTitle
              href={getHref?.(item)}
              onClick={event => {
                onItemClick?.(event, item);
              }}
              style={{
                paddingLeft: depth >= 2 ? `${1 + (depth - 1) * 1.25}rem` : `1rem`,
              }}
              className={toplevel ? styles.bold : undefined}
            >
              {!toplevel && childItems.length > 0 && <FaChevronRight className={styles.icon} />}
              {(getTitle ?? String)(item)}
            </MenuItemTitle>

            {childItems.length > 0 && (
              <MenuItemBody>
                <Menu
                  depth={depth + 1}
                  items={childItems}
                  {...{ getTitle, getHref, isActive: isActive, onItemClick, getChildItems }}
                />
              </MenuItemBody>
            )}
          </MenuItem>
        );
      })}
    </>
  );
}

export function MenuItem({
  active = false,
  open: openProp,
  defaultOpen,
  onToggle,
  children,
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (event: { open: boolean }) => void;
}) {
  const [store] = useState(() =>
    createMicroStore<{ open: boolean }>({
      open: openProp ?? defaultOpen ?? true,
    }),
  );
  const state = useSyncExternalStore(store.subscribe, store.getState);

  useIsomorphicLayoutEffect(() => {
    if (openProp !== undefined && openProp !== state.open) {
      store.setState({ open: openProp });
    }
  }, [openProp, state.open]);

  const rootClassName = classNames(
    styles.menuitem,
    active && styles.active,
    state.open && styles.open,
    className,
  );

  return (
    <MenuItemContext.Provider value={{ store, controlled: openProp !== undefined }}>
      <div data-kind='MenuItem' className={rootClassName} {...restProps}>
        {children}
      </div>
    </MenuItemContext.Provider>
  );
}

export function MenuItemTitle({
  children,
  className,
  onClick,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { store, controlled } = useContext(MenuItemContext);

  return (
    <a
      className={classNames(styles.menuitemTitle, className)}
      onClick={event => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (!controlled) {
          store.setState({ open: !store.getState().open });
        }
      }}
      {...restProps}
    >
      {children}
    </a>
  );
}

export function MenuItemBody({
  children,
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement>) {
  const { store } = useContext(MenuItemContext);
  const state = useSyncExternalStore(store.subscribe, store.getState);

  if (!state.open) {
    return null;
  }

  return (
    <div className={classNames(styles.menuitemBody, className)} {...restProps}>
      {children}
    </div>
  );
}
