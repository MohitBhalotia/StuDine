"use client";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { createAuthClient } from "better-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getOrdersWithMenu, getOrdersWithMenuByUserId } from "@/actions/order";

const { useSession } = createAuthClient();

export const description = "An interactive area chart for order analytics";

const chartConfig = {
  Breakfast: {
    label: "Breakfast",
    color: "#f59e0b",
  },
  Lunch: {
    label: "Lunch",
    color: "#10b981",
  },
  Snacks: {
    label: "Snacks",
    color: "#8b5cf6",
  },
  Dinner: {
    label: "Dinner",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function ChartAreaInteractiveStudent() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("90d");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Fetch orders with menu data
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const result = await getOrdersWithMenuByUserId(userId);
        if (result.success && result.data) {
          setOrders(result.data);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPending && userId) {
      fetchOrderData();
    }
  }, [userId, isPending]);

  // Process order data to group by date and meal time
  const processOrderData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }
    const dataMap = new Map<
      string,
      { Breakfast: number; Lunch: number; Snacks: number; Dinner: number }
    >();
    orders.forEach((order: any) => {
      if (!order.orderTime) return;
      const date = new Date(order.orderTime).toISOString().split("T")[0];
      const mealTime = order.mealTime || "Breakfast";
      if (!dataMap.has(date)) {
        dataMap.set(date, { Breakfast: 0, Lunch: 0, Snacks: 0, Dinner: 0 });
      }
      const currentData = dataMap.get(date)!;
      currentData[mealTime as keyof typeof currentData] += order.quantity;
    });
    return Array.from(dataMap.entries())
      .map(([date, counts]) => ({
        date,
        Breakfast: counts.Breakfast,
        Lunch: counts.Lunch,
        Snacks: counts.Snacks,
        Dinner: counts.Dinner,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [orders]);

  // Filter data based on selected time range and fill missing dates
  const getFilteredData = useMemo(() => {
    // Calculate date range
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Create a map of all dates in the range with default values
    const dateRangeMap = new Map<
      string,
      { Breakfast: number; Lunch: number; Snacks: number; Dinner: number }
    >();

    // Fill all dates in the range with 0 values
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dateRangeMap.set(dateStr, {
        Breakfast: 0,
        Lunch: 0,
        Snacks: 0,
        Dinner: 0,
      });
    }

    // Override with actual data where available
    processOrderData.forEach((item) => {
      const itemDate = new Date(item.date);
      if (itemDate >= startDate && itemDate <= endDate) {
        dateRangeMap.set(item.date, {
          Breakfast: item.Breakfast,
          Lunch: item.Lunch,
          Snacks: item.Snacks,
          Dinner: item.Dinner,
        });
      }
    });

    // Convert to array and sort
    return Array.from(dateRangeMap.entries())
      .map(([date, counts]) => ({
        date,
        Breakfast: counts.Breakfast,
        Lunch: counts.Lunch,
        Snacks: counts.Snacks,
        Dinner: counts.Dinner,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [processOrderData, timeRange]);

  // Dynamic description based on time range
  const getTimeRangeDescription = () => {
    switch (timeRange) {
      case "7d":
        return {
          desktop: "Last 7 days",
          mobile: "7 days",
        };
      case "30d":
        return {
          desktop: "Last 30 days",
          mobile: "30 days",
        };
      case "90d":
      default:
        return {
          desktop: "Last 3 months",
          mobile: "3 months",
        };
    }
  };

  const timeDescription = getTimeRangeDescription();

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Order Analytics</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                {timeDescription.desktop}
              </span>
              <span className="@[540px]/card:hidden">
                {timeDescription.mobile}
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col @[360px]/card:flex-row gap-2 items-start mt-2 sm:mt-0">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center">
            <div className="text-muted-foreground">Loading order data...</div>
          </div>
        ) : getFilteredData.length === 0 ? (
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <p>No order data available</p>
              <p className="text-sm">Place your first order to see analytics</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={getFilteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillBreakfast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillLunch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillSnacks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillDinner" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[
                  0,
                  (dataMax: number) => Math.max(3, Math.ceil(dataMax * 1.2)),
                ]}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      if (
                        typeof value === "string" ||
                        typeof value === "number"
                      ) {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }
                      return value;
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="Breakfast"
                type="monotone"
                fill="url(#fillBreakfast)"
                stroke="#f59e0b"
                name="Breakfast"
                stackId="a"
              />
              <Area
                dataKey="Lunch"
                type="monotone"
                fill="url(#fillLunch)"
                stroke="#10b981"
                name="Lunch"
                stackId="a"
              />
              <Area
                dataKey="Snacks"
                type="monotone"
                fill="url(#fillSnacks)"
                stroke="#8b5cf6"
                name="Snacks"
                stackId="a"
              />
              <Area
                dataKey="Dinner"
                type="monotone"
                fill="url(#fillDinner)"
                stroke="#3b82f6"
                name="Dinner"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function ChartAreaInteractiveAdmin() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("90d");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Fetch orders with menu data
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const result = await getOrdersWithMenu(userId);
        if (result.success && result.data) {
          setOrders(result.data);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPending && userId) {
      fetchOrderData();
    }
  }, [userId, isPending]);

  // Process order data to group by date and meal time
  const processOrderData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }
    const dataMap = new Map<
      string,
      { Breakfast: number; Lunch: number; Snacks: number; Dinner: number }
    >();
    orders.forEach((order: any) => {
      if (!order.orderTime) return;
      const date = new Date(order.orderTime).toISOString().split("T")[0];
      const mealTime = order.mealTime || "Breakfast";
      if (!dataMap.has(date)) {
        dataMap.set(date, { Breakfast: 0, Lunch: 0, Snacks: 0, Dinner: 0 });
      }
      const currentData = dataMap.get(date)!;
      currentData[mealTime as keyof typeof currentData] += order.quantity;
    });
    return Array.from(dataMap.entries())
      .map(([date, counts]) => ({
        date,
        Breakfast: counts.Breakfast,
        Lunch: counts.Lunch,
        Snacks: counts.Snacks,
        Dinner: counts.Dinner,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [orders]);

  // Filter data based on selected time range and fill missing dates
  const getFilteredData = useMemo(() => {
    // Calculate date range
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Create a map of all dates in the range with default values
    const dateRangeMap = new Map<
      string,
      { Breakfast: number; Lunch: number; Snacks: number; Dinner: number }
    >();

    // Fill all dates in the range with 0 values
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dateRangeMap.set(dateStr, {
        Breakfast: 0,
        Lunch: 0,
        Snacks: 0,
        Dinner: 0,
      });
    }

    // Override with actual data where available
    processOrderData.forEach((item) => {
      const itemDate = new Date(item.date);
      if (itemDate >= startDate && itemDate <= endDate) {
        dateRangeMap.set(item.date, {
          Breakfast: item.Breakfast,
          Lunch: item.Lunch,
          Snacks: item.Snacks,
          Dinner: item.Dinner,
        });
      }
    });

    // Convert to array and sort
    return Array.from(dateRangeMap.entries())
      .map(([date, counts]) => ({
        date,
        Breakfast: counts.Breakfast,
        Lunch: counts.Lunch,
        Snacks: counts.Snacks,
        Dinner: counts.Dinner,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [processOrderData, timeRange]);

  // Dynamic description based on time range
  const getTimeRangeDescription = () => {
    switch (timeRange) {
      case "7d":
        return {
          desktop: "Last 7 days",
          mobile: "7 days",
        };
      case "30d":
        return {
          desktop: "Last 30 days",
          mobile: "30 days",
        };
      case "90d":
      default:
        return {
          desktop: "Last 3 months",
          mobile: "3 months",
        };
    }
  };

  const timeDescription = getTimeRangeDescription();

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Order Analytics</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                {timeDescription.desktop}
              </span>
              <span className="@[540px]/card:hidden">
                {timeDescription.mobile}
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col @[360px]/card:flex-row gap-2 items-start mt-2 sm:mt-0">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center">
            <div className="text-muted-foreground">Loading order data...</div>
          </div>
        ) : getFilteredData.length === 0 ? (
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <p>No order data available</p>
              <p className="text-sm">Place your first order to see analytics</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={getFilteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillBreakfast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillLunch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillSnacks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillDinner" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[
                  0,
                  (dataMax: number) => Math.max(3, Math.ceil(dataMax * 1.2)),
                ]}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      if (
                        typeof value === "string" ||
                        typeof value === "number"
                      ) {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }
                      return value;
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="Breakfast"
                type="monotone"
                fill="url(#fillBreakfast)"
                stroke="#f59e0b"
                name="Breakfast"
                stackId="a"
              />
              <Area
                dataKey="Lunch"
                type="monotone"
                fill="url(#fillLunch)"
                stroke="#10b981"
                name="Lunch"
                stackId="a"
              />
              <Area
                dataKey="Snacks"
                type="monotone"
                fill="url(#fillSnacks)"
                stroke="#8b5cf6"
                name="Snacks"
                stackId="a"
              />
              <Area
                dataKey="Dinner"
                type="monotone"
                fill="url(#fillDinner)"
                stroke="#3b82f6"
                name="Dinner"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}