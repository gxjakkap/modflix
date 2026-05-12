import { t } from "elysia";

export const dashboardStatsModel = {
  response: t.Object({
    data: t.Object({
      userCount: t.Number(),
      userOneDDiffPercent: t.Number(),
      orderCount: t.Number(),
      orderOneDDiffPercent: t.Number(),
      salesCount: t.Number(),
      salesOneDDiffPercent: t.Number(),
      topUsers: t.Array(
        t.Object({
          username: t.String(),
          image: t.String(),
        }),
      ),
      sevenDaysRevenue: t.Array(
        t.Object({
          day: t.String(),
          revenue: t.Number(),
        }),
      ),
      sevenDaysPurchasements: t.Array(
        t.Object({
          day: t.String(),
          count: t.Number(),
        }),
      ),
    }),
  }),
};
