export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export interface UserOrder {
  id: number;
  userId: string;
  amount: number;
  status: OrderStatus;
}

export interface UserStats {
  userId: string;
  count: number;
  total: number;
}

export default function getUserStats(orders: UserOrder[]): UserStats[] {
  type UserStatsMap = Map<string, Omit<UserStats, "userId">>;

  const userStatsMapped = orders
    .filter(order => order.status === 'paid')
    .reduce<UserStatsMap>((userStatsMap: UserStatsMap, order) => {
      const userId = order.userId;
      if (!(userId && typeof userId === 'string')) {
        return userStatsMap;
      }

      const amount = order.amount;
      if (Number.isFinite(order.amount) && amount >= 0) {
        const stats = userStatsMap.get(userId);
        if (!stats || typeof stats !== 'object') {
          userStatsMap.set(userId, { count: 1, total: amount });
        } else {
          const { count: currentCount = 0, total: currentTotal = 0 } = stats;
          userStatsMap.set(userId, { count: currentCount + 1, total: currentTotal + amount });
        }
      }

      return userStatsMap;
    }, new Map());

  return Array.from(userStatsMapped.entries())
    .map(([key, value]) => {
      return { userId: key, ...value };
    }).sort((a, b) => {
      if (b.total - a.total !== 0) {
        return b.total - a.total;
      }

      return a.userId.localeCompare(b.userId);
    });
}
