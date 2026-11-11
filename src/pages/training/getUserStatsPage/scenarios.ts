import type { UserOrder, UserStats } from "./getUserStats";

type Scenario = { name: string; input: UserOrder[]; expected: UserStats[] };

// These deliberately invalid fields simulate data received at runtime.
const invalid = (userId: unknown, amount: unknown): UserOrder =>
  ({ id: 1, userId, amount, status: "paid" }) as UserOrder;

export const scenarios: Scenario[] = [
  {
    name: "Пример из условия",
    input: [
      { id: 1, userId: "alice", amount: 100, status: "paid" },
      { id: 2, userId: "bob", amount: 200, status: "pending" },
      { id: 3, userId: "alice", amount: 150, status: "paid" },
      { id: 4, userId: "bob", amount: 300, status: "paid" },
      { id: 5, userId: "charlie", amount: 50, status: "cancelled" },
      { id: 6, userId: "bob", amount: 100, status: "paid" },
    ],
    expected: [
      { userId: "bob", count: 2, total: 400 },
      { userId: "alice", count: 2, total: 250 },
    ],
  },
  { name: "Пустой массив", input: [], expected: [] },
  {
    name: "Нет оплаченных заказов",
    input: [
      { id: 1, userId: "alice", amount: 10, status: "pending" },
      { id: 2, userId: "bob", amount: 20, status: "cancelled" },
    ],
    expected: [],
  },
  {
    name: "Нулевая сумма и равные итоги",
    input: [invalid("bob", 10), invalid("alice", 0), invalid("alice", 10), invalid("zero", 0)],
    expected: [
      { userId: "alice", count: 2, total: 10 },
      { userId: "bob", count: 1, total: 10 },
      { userId: "zero", count: 1, total: 0 },
    ],
  },
  {
    name: "Некорректные поля",
    input: [
      ...["", null, undefined, 123, {}, false].map(id => invalid(id, 10)),
      ...[-1, NaN, Infinity, -Infinity, "100", null, undefined, true].map(amount => invalid("invalid", amount)),
    ],
    expected: [],
  },
  {
    name: "Специальные userId",
    input: [invalid("__proto__", 30), invalid("constructor", 20), invalid("toString", 10), invalid("__proto__", 0)],
    expected: [
      { userId: "__proto__", count: 2, total: 30 },
      { userId: "constructor", count: 1, total: 20 },
      { userId: "toString", count: 1, total: 10 },
    ],
  },
  {
    name: "Валидный и некорректный заказ одного пользователя",
    input: [invalid("alice", 5), invalid("alice", -1), invalid("alice", "10")],
    expected: [{ userId: "alice", count: 1, total: 5 }],
  },
];
