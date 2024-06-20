import { ReactNode, useState } from 'react';
import { Link } from '../../components/Link';
import { AnyMenuNode, StoryMenuNode } from '../../utils/menu';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa6';
import classNames from 'classnames';
import styles from './Menu.m.css';

interface MenuItemProps {
  level?: number;
  defaultOpen?: boolean;
  canToggle?: boolean;
  data: AnyMenuNode;
  onStoryClick?: (item: StoryMenuNode) => void;
  isCurrent?: (item: AnyMenuNode) => boolean;
}

export function MenuItem({
  level = 0,
  data,
  onStoryClick,
  isCurrent,
  defaultOpen = false,
  canToggle = true,
}: MenuItemProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  let content: ReactNode;

  const titleClassName = classNames(
    styles.title,
    level === 0 && data.type === 'group' && styles.toplevel,
    isCurrent?.(data) && styles.current,
  );

  if (data.type === 'story') {
    content = (
      <Link
        className={titleClassName}
        href={`/sandbox.html?path=${data.story.pathname}`}
        onClick={event => {
          event.preventDefault();
          onStoryClick?.(data);
        }}
        color='unset'
      >
        {data.title}
      </Link>
    );
  } else {
    content = (
      <>
        <div className={titleClassName} onClick={() => canToggle && setOpen(a => !a)}>
          {canToggle && (
            <>
              {open ? (
                <FaChevronDown className={styles.icon} />
              ) : (
                <FaChevronRight className={styles.icon} />
              )}
            </>
          )}
          {data.title}
        </div>
        {open && (
          <div>
            {data.items.map((item, index) => (
              <MenuItem
                level={level + 1}
                key={index}
                data={item}
                onStoryClick={onStoryClick}
                isCurrent={isCurrent}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={classNames(styles.menuitem, level === 0 && styles.toplevel)}
      style={{ '--menu-level': level < 2 ? 1 : level } as any}
    >
      {content}
    </div>
  );
}
