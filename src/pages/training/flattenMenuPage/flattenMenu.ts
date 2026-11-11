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

export default function flattenMenu(items: MenuItem[]): FlatMenuItem[] {
  // TODO: implement
  return [];
}
