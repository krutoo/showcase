/**
 * This is Link component module.
 * This is public component. So it should work as regular `a` but with next features:
 * - use default styles from css-variables
 * - routing by router from context if applicable
 */
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useNavigate } from '../../shared/router-react';
import classNames from 'classnames';
import styles from './link.m.css';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Controls default styles applying. */
  defaultStyles?: 'unset';
}

export function Link({
  children,
  href,
  target,
  className,
  onClick,
  defaultStyles,
  ...restProps
}: LinkProps): ReactNode {
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (!href) {
      return;
    }

    if (target) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  const rootClassName = classNames(
    //
    defaultStyles !== 'unset' && styles.link,
    className,
  );

  return (
    <a
      href={href}
      target={target}
      className={rootClassName}
      onClick={handleClick}
      data-kind='Link'
      {...restProps}
    >
      {children}
    </a>
  );
}
