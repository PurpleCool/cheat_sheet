import type { ExampleDefinition } from "../../../components/example";
import debounceSource from "./debounce.ts?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

export const debounceExample: ExampleDefinition = {
  id: "debounce",
  title: "Debounce",
  entry: Result,
  files: [
    { path: "debounce.ts", language: "ts", source: debounceSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  exercise: {
    sourceUrl: "https://www.greatfrontend.com/questions/javascript/debounce",
    sourceLabel: "Источник: GreatFrontEnd — Debounce",
    statement: (
      <>
        <p>Пересказ условия.</p>
        <p>
          Реализуйте debounce(func, wait), возвращающую функцию-обёртку. При
          обращении к обёртке func не срабатывает сразу: вызов происходит после
          wait миллисекунд без новых обращений. Повторное обращение перезапускает
          ожидание; func получает аргументы и this последнего обращения.
        </p>
        <p>
          func — исходная функция, wait — задержка в миллисекундах. Вызов обёртки
          не возвращает результат отложенного func. Например, при задержке 100 мс
          и обращениях в 0 и 50 мс func сработает один раз, не раньше 150 мс.
        </p>
        <p>
          Расширение: cancel() отменяет ожидающий вызов; flush() выполняет его
          немедленно ровно один раз. Если ожидающего вызова нет, оба метода ничего
          не делают. Новые обращения работают и после cancel()/flush().
        </p>
      </>
    ),
  },
  notes: [
    "Авторская версия сохранена. Ограничение: если func снова вызовет эту же обёртку, новый вызов теряется, поскольку очистка после func стирает его аргументы.",
  ],
  playground: { entryFile: "result.tsx" },
};
