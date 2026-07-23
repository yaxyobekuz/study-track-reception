// TanStack Query
import { queryOptions, useQuery } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { holidaysAPI } from "../api/holidays.api";

export const holidaysKeys = createQueryKeys("holidays");

const CHECK_TODAY_KEY = [...holidaysKeys.all, "check", "today"];

export const holidaysQueries = {
  /** Whether today is a holiday → `{ isHoliday, holiday }`. */
  checkToday: () =>
    queryOptions({
      queryKey: CHECK_TODAY_KEY,
      queryFn: () => holidaysAPI.checkToday().then((r) => r.data.data),
    }),
};

/**
 * Today's holiday status. On error the data stays undefined, so consumers
 * should default it (the banner then simply renders nothing).
 *
 * @example
 * const { data: today = { isHoliday: false, holiday: null } } = useTodayHoliday();
 */
export const useTodayHoliday = () => useQuery(holidaysQueries.checkToday());
