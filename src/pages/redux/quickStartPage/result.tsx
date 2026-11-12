import { Provider } from "react-redux";
import { store } from "./app/store";
import { Counter } from "./features/counter/Counter";

export default function Result() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
