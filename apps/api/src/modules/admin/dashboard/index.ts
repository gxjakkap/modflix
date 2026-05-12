import Elysia from "elysia";
import { ErrorModel } from "@/schemas/error";
import { dashboardStatsModel } from "./model";
import {
  getLastSevenDaysPurchasementCount,
  getLastSevenDaysRevenue,
  getOrderCountAndDiff,
  getSalesAndDiff,
  getTopThreePayingCustomer,
  getUserCountAndDiff,
} from "./service";

export const dashboardModules = new Elysia({ prefix: "/dash" }).get(
  "/",
  async () => {
    const [
      userCountAndDiff,
      orderCountAndDiff,
      salesAndDiff,
      topThreeCustomer,
      sevenDaysRevenue,
      sevenDaysPurchasements,
    ] = await Promise.all([
      getUserCountAndDiff(),
      getOrderCountAndDiff(),
      getSalesAndDiff(),
      getTopThreePayingCustomer(),
      getLastSevenDaysRevenue(),
      getLastSevenDaysPurchasementCount(),
    ]);

    return {
      data: {
        userCount: userCountAndDiff.total,
        userOneDDiffPercent: userCountAndDiff.diffPercent,
        orderCount: orderCountAndDiff.total,
        orderOneDDiffPercent: orderCountAndDiff.diffPercent,
        salesCount: salesAndDiff.total,
        salesOneDDiffPercent: salesAndDiff.diffPercent,
        topUsers: topThreeCustomer.map((c) => ({
          username: c.name,
          image: c.image,
        })),
        sevenDaysRevenue,
        sevenDaysPurchasements,
      },
    };
  },
  {
    response: {
      200: dashboardStatsModel.response,
      400: ErrorModel,
      404: ErrorModel,
      500: ErrorModel,
    },
  },
);
