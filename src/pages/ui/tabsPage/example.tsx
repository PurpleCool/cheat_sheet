import type { ExampleDefinition } from "../../../components/example";
import appSource from "./app.tsx?raw";
import Result from "./result";
import stylesSource from "./styles.css?raw";
import tabsSource from "./tabs.tsx?raw";

export const tabsExample: ExampleDefinition = {
  id: "tabs",
  title: "Tabs",
  entry: Result,
  files: [
    { path: "app.tsx", language: "tsx", source: appSource },
    { path: "tabs.tsx", language: "tsx", source: tabsSource },
    { path: "styles.css", language: "css", source: stylesSource },
  ],
  exercise: {
    sourceUrl: "https://www.greatfrontend.com/questions/user-interface/tabs",
    sourceLabel: "Источник: GreatFrontEnd — Tabs",
    statement: (
      <>
        <p>Требования изложены своими словами, это не точная копия условия.</p>
        <p>Создайте компонент вкладок для переключения между несколькими разделами содержимого.</p>
        <ul>
          <li>Нажатие на вкладку выбирает её и показывает соответствующее содержимое.</li>
          <li>Активная вкладка визуально выделяется синим цветом; одновременно показана только одна панель.</li>
          <li>Предусмотрите выбор начальной активной вкладки и независимую работу нескольких экземпляров компонента.</li>
        </ul>
        <p>
          Главное — функциональность, а не точное оформление. Достаточно выделить
          активную вкладку; разметку можно менять, клиентский рендеринг допустим.
          Дополнительные улучшения UX необязательны.
        </p>
      </>
    ),
  },
  notes: [
    "Авторская базовая реализация сохранена: начальная вкладка — всегда HTML, настройки начальной вкладки через props нет. Нативные кнопки доступны через Tab и активируются Enter/Space; полный ARIA-паттерн вкладок и навигация стрелками не реализованы. Стили изолированы в iframe и не влияют на cheat-sheet.",
  ],
  playground: { entryFile: "app.tsx" },
};
