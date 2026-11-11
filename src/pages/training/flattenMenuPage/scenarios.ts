import type { FlatMenuItem, MenuItem } from "./flattenMenu";

type Scenario = { name: string; input: MenuItem[]; expected: FlatMenuItem[] };

export const scenarios: Scenario[] = [
  {
    name: "Пример из условия",
    input: [
      { id: "home", title: "Главная" },
      {
        id: "catalog", title: "Каталог",
        children: [
          {
            id: "phones", title: "Телефоны",
            children: [{ id: "android", title: "Android" }],
          },
          { id: "laptops", title: "Ноутбуки" },
        ],
      },
      { id: "about", title: "О нас" },
    ],
    expected: [
      { id: "home", title: "Главная", depth: 0, parentId: null },
      { id: "catalog", title: "Каталог", depth: 0, parentId: null },
      { id: "phones", title: "Телефоны", depth: 1, parentId: "catalog" },
      { id: "android", title: "Android", depth: 2, parentId: "phones" },
      { id: "laptops", title: "Ноутбуки", depth: 1, parentId: "catalog" },
      { id: "about", title: "О нас", depth: 0, parentId: null },
    ],
  },
  { name: "Пустой массив", input: [], expected: [] },
  {
    name: "Без вложенных элементов",
    input: [{ id: "b", title: "Второй" }, { id: "a", title: "Первый" }],
    expected: [
      { id: "b", title: "Второй", depth: 0, parentId: null },
      { id: "a", title: "Первый", depth: 0, parentId: null },
    ],
  },
  {
    name: "Несколько уровней вложенности",
    input: [{
      id: "root", title: "Корень",
      children: [{
        id: "child", title: "Ребёнок",
        children: [{
          id: "grandchild", title: "Внук",
          children: [{ id: "leaf", title: "Лист" }],
        }],
      }],
    }],
    expected: [
      { id: "root", title: "Корень", depth: 0, parentId: null },
      { id: "child", title: "Ребёнок", depth: 1, parentId: "root" },
      { id: "grandchild", title: "Внук", depth: 2, parentId: "child" },
      { id: "leaf", title: "Лист", depth: 3, parentId: "grandchild" },
    ],
  },
  {
    name: "Пустые children",
    input: [{ id: "empty", title: "Пустой раздел", children: [] }],
    expected: [{ id: "empty", title: "Пустой раздел", depth: 0, parentId: null }],
  },
];
