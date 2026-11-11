export interface MenuItem {
  id: string;
  title: string;
  children?: MenuItem[];
}

export interface FlatMenuItem {
  id: string;
  title: string;
  depth: number;
  parentId: string | null;
}

function flattenItem(
  flattenArray: FlatMenuItem[],
  item: MenuItem,
  depth: number,
  parentId: string | null
) {
  flattenArray.push({ id: item.id, title: item.title, depth, parentId });
  if (item.children) {
    item.children.forEach((child) =>
      flattenItem(flattenArray, child, depth + 1, item.id)
    );
  }
}

export default function flattenMenu(items: MenuItem[]): FlatMenuItem[] {
  const flattenArray: FlatMenuItem[] = [];
  items.forEach((item) => flattenItem(flattenArray, item, 0, null));
  return flattenArray;
}
