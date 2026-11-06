import { useState } from "react";
import { useIsFirstRender } from "./useIsFirstRender";

function Demo() {
  const [count, setCount] = useState(0);
  const isFirstRender = useIsFirstRender();

  return (
    <div>
      <p role="status" aria-label="Первый рендер">
        isFirstRender: {String(isFirstRender)}
      </p>
      <p>Обновлений: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Вызвать повторный рендер
      </button>
    </div>
  );
}

export default function Result() {
  const [instance, setInstance] = useState(0);

  return (
    <section className="result" aria-label="Демонстрация useIsFirstRender">
      <p>
        При первом рендере хук возвращает true. Нажмите кнопку повторного рендера,
        чтобы увидеть false. Изменение ref в эффекте само по себе не вызывает
        рендер. Пересоздание компонента начинает пример заново с true.
      </p>
      <Demo key={instance} />
      <button type="button" onClick={() => setInstance((value) => value + 1)}>
        Пересоздать компонент
      </button>
    </section>
  );
}
