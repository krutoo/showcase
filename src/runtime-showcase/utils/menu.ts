import { type StoryModule } from '#core';

export interface MenuNode {
  type: string;
  menuPriority?: number;
  menuHidden?: boolean;
}

export interface StoryMenuNode extends MenuNode {
  type: 'story';
  title: string;
  category?: string;
  story: StoryModule;
}

export interface GroupMenuNode extends MenuNode {
  type: 'group';
  title: string;
  items: AnyMenuNode[];
  story?: StoryModule;
}

export type AnyMenuNode = StoryMenuNode | GroupMenuNode;

/**
 * Получив список story-модулей сформирует меню с группами по значениям в полях category.
 * @inheritdoc
 */
export function getMenuItems(stories: StoryModule[]): AnyMenuNode[] {
  // создаем узел меню из объекта story
  const nodes = stories.map<StoryMenuNode>(story => ({
    type: 'story',
    title: story.meta?.title ?? story.metaJson?.title ?? story.pathname,
    category: story.meta?.category ?? story.metaJson?.category ?? '',
    menuPriority: story.meta?.menuPriority,
    menuHidden: story.meta?.menuHidden,
    story,
  }));

  return groupMenuNodes(nodes);
}

/**
 * Получив список узлов меню сгруппирует их по значениям в полях category.
 * @inheritdoc
 */
function groupMenuNodes(nodes: AnyMenuNode[]): AnyMenuNode[] {
  const compare = (a: AnyMenuNode, b: AnyMenuNode) => {
    return comparePriorityDesc(a, b) || compareCategoryDesc(a, b) || compareTitleDesc(a, b);
  };

  // рекурсивно применяем группировку узлов по полю category
  return nodes
    .reduce<AnyMenuNode[]>(groupStoriesByFirstSegment, [])
    .map(node =>
      node.type === 'group'
        ? {
            ...node,
            items: groupMenuNodes(node.items).sort(compare),
          }
        : node,
    )
    .sort(compare);
}

/**
 * Reducer для группировки списка узлов меню.
 * @inheritdoc
 */
function groupStoriesByFirstSegment(state: AnyMenuNode[], node: AnyMenuNode): AnyMenuNode[] {
  // если это уже группа - оставляем как есть
  if (node.type === 'group') {
    state.push(node);
    return state;
  }

  // разбиваем строку category на сегменты
  const segments = node.category?.includes('/')
    ? node.category.split('/').filter(Boolean)
    : [node.category ?? ''];

  // первый сегмент - целевая группа, остальные будут обработаны далее рекурсией
  const [groupName, ...restSegments] = segments;

  // создаем новый узел на основе старого
  const newNode: StoryMenuNode = {
    ...node,
    title: node.title,
    category: restSegments.join('/') || undefined,
  };

  // если нет имени группы оставляем узел на том уровне на котором он был
  if (groupName === '') {
    if (!newNode.menuHidden) {
      state.push(newNode);
    }
    return state;
  }

  // ищем группу по имени, тк возможно уже создали ее на предыдущем шаге цикла
  const foundGroup = state.find(
    (item): item is GroupMenuNode => item.type === 'group' && item.title === groupName,
  );

  const targetGroup = foundGroup ?? {
    type: 'group',
    title: groupName,
    items: [],
  };

  // если не нашли существующую группу - добавляем вновь созданную в список
  if (!foundGroup) {
    state.push(targetGroup);
  }

  if (newNode.title === '') {
    // если узел это "корень группы" - применяем его опции к группе
    targetGroup.story = newNode.story;
    targetGroup.menuPriority = newNode.menuPriority;
  } else if (!newNode.menuHidden) {
    // иначе просто добавляем его в группу если он не скрыт
    targetGroup.items.push(newNode);
  }

  return state;
}

function compareCategoryDesc(a: AnyMenuNode, b: AnyMenuNode): number {
  if (a.type === 'story' && b.type === 'story' && a.category && b.category) {
    return a.category.localeCompare(b.category);
  }
  return 0;
}

function compareTitleDesc(a: AnyMenuNode, b: AnyMenuNode): number {
  if (a.title && b.title) {
    return a.title.localeCompare(b.title);
  }
  return 0;
}

function comparePriorityDesc(a: AnyMenuNode, b: AnyMenuNode): number {
  return (b.menuPriority ?? 0) - (a.menuPriority ?? 0);
}
