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
      <div lang="en">
        <p>
          Debouncing controls how often a function can execute over time. When a
          JavaScript function is debounced with a wait time of <code>wait</code>{" "}
          milliseconds, it runs only after <code>wait</code> milliseconds have
          elapsed since the debounced function was last called.
        </p>
        <p>
          You have probably encountered debouncing in daily life before, such as
          when entering an elevator. Only after some time passes without pressing
          the &quot;Door open&quot; button (the debounced function not being called)
          will the elevator door actually close (the callback function is
          executed).
        </p>
        <p>
          Implement <code>debounce(func, wait)</code> so that <code>func</code> is
          called only after <code>wait</code> milliseconds have passed since the
          most recent call. The returned function should not invoke{" "}
          <code>func</code> immediately. When the delayed call finally runs, it
          should use the latest arguments and preserve the <code>this</code> value
          from the most recent call.
        </p>
        <h3>Arguments</h3>
        <ul>
          <li><code>func</code> (Function): The callback to debounce.</li>
          <li>
            <code>wait</code> (number): The number of milliseconds to wait after the
            latest call.
          </li>
        </ul>
        <h3>Returns</h3>
        <p>(Function): Returns the debounced function.</p>
        <h3>Examples</h3>
        <pre className="exercise-code"><code>{`let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.

// t = 100: increment() was invoked and i is now 1.`}</code></pre>
        <p><code>debouncedIncrement()</code> is called multiple times.</p>
        <pre className="exercise-code"><code>{`let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.
//  Call debouncedIncrement() again.
debouncedIncrement(); // i = 0

// t = 100: i is still 0 because it has only
//  been 50ms since the last debouncedIncrement() at t = 50.

// t = 150: Because 100ms have passed since
//  the last debouncedIncrement() at t = 50,
//  increment was invoked and i is now 1.`}</code></pre>
        <h3>Follow-up</h3>
        <ul>
          <li>
            Debounce with a <code>cancel()</code> method to cancel delayed
            invocations and a <code>flush()</code> method to immediately invoke
            them.
          </li>
          <li>
            Implement <code>throttle</code>, which is similar to debounce but a
            little different.
          </li>
        </ul>
      </div>
    ),
  },
  notes: [
    "Авторская версия сохранена. Ограничение: если func снова вызовет эту же обёртку, новый вызов теряется, поскольку очистка после func стирает его аргументы.",
  ],
  playground: { entryFile: "result.tsx" },
};
