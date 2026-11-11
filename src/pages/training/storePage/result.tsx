import { useState } from "react";
import { Store } from "./store";

type StoreData = { value: number };

export default function Result() {
  const [messages, setMessages] = useState<string[]>([]);

  const runCheck = () => {
    const nextMessages: string[] = [];
    const store = new Store<StoreData>({ value: 0 });

    const cb1 = (data: StoreData) => {
      nextMessages.push(`Subscriber 1: ${JSON.stringify(data)}`);
    };
    const cb2 = (data: StoreData) => {
      nextMessages.push(`Subscriber 2: ${JSON.stringify(data)}`);
    };

    store.subscribe(cb1);
    store.subscribe(cb2);

    store.data = { value: 1 };
    store.unsubscribe(cb1);
    store.data = { value: 2 };

    setMessages(nextMessages);
  };

  return (
    <section className="result" aria-label="Проверка Store">
      <button type="button" onClick={runCheck}>Запустить проверку</button>
      <h3>Уведомления</h3>
      <div aria-live="polite" role="log">
        {messages.length === 0 ? (
          <p>Вызовов пока нет.</p>
        ) : (
          <ol>
            {messages.map((message, index) => (
              <li key={`${index}-${message}`}><code>{message}</code></li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
