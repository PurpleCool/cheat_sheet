import type { ExampleDefinition } from "../../../components/example";
import appSource from "./app.tsx?raw";
import Result from "./result";
import stylesSource from "./styles.css?raw";

export const holyGrailExample: ExampleDefinition = {
  id: "holy-grail",
  title: "Holy Grail",
  entry: Result,
  files: [
    { path: "app.tsx", language: "tsx", source: appSource },
    { path: "styles.css", language: "css", source: stylesSource },
  ],
  exercise: {
    sourceUrl: "https://www.greatfrontend.com/questions/user-interface/holy-grail",
    sourceLabel: "Источник: GreatFrontEnd — Holy Grail",
    statement: (
      <>
        <p>Требования изложены своими словами, это не точная копия условия.</p>
        <p>
          Создайте макет Holy Grail с помощью CSS, без существенных изменений HTML:
          шапка и подвал на всю ширину, между ними три колонки. Слева — навигация,
          в центре — основной контент, справа — боковая панель для рекламы.
        </p>
        <ul>
          <li>Шапка занимает всю ширину страницы и имеет высоту 60px.</li>
          <li>Левая и правая колонки имеют фиксированную ширину 100px каждая.</li>
          <li>Ширина центральной колонки гибкая: она занимает оставшееся место.</li>
          <li>Высота всех трёх колонок одинакова и определяется самой высокой из них.</li>
          <li>Подвал занимает всю ширину страницы и имеет высоту 100px.</li>
          <li>При коротком контенте подвал остаётся у нижней границы viewport.</li>
        </ul>
      </>
    ),
  },
  notes: [
    "Исходное решение сохранено. Ползунки «Ширина» и «Высота» меняют размер viewport превью в пикселях. Превью изолировано в iframe: единица vh относится к его viewport, а CSS не влияет на страницу cheat-sheet. Если превью шире контейнера, используйте горизонтальную прокрутку.",
  ],
  playground: { entryFile: "app.tsx" },
};
