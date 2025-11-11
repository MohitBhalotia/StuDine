"use client";
import { useEffect, useState } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getDailyChangePercent,
  getMonthlyAmountSpentByUserId,
  getMonthlyChangePercent,
  getMonthlyChangePercentByUserId,
  getMonthlyOrders,
  getMostOrderedItemByUserId,
  getOpenIssuesCount,
  getTodaysOrders,
  getTodaysUniqueOrders,
  getTotalAmountSpentByUserId,
} from "@/actions/order";
import { getIssuesCountByUserId } from "@/actions/issues";
import { createAuthClient } from "better-auth/react";
import { Loader2, ShoppingCart } from "lucide-react";

const { useSession } = createAuthClient();

export function SectionCardsStudent() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const [totalAmountSpent, setTotalAmountSpent] = useState(0);
  const [monthlyAmountSpent, setMonthlyAmountSpent] = useState(0);
  const [monthlyChangePercent, setMonthlyChangePercent] = useState(0);
  const [mostOrderedItem, setMostOrderedItem] = useState<Menu | null>(null);
  const [issuesCount, setIssuesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async (userId: string) => {
      try {
        setLoading(true);

        const totalAmountSpentResult =
          await getTotalAmountSpentByUserId(userId);
        setTotalAmountSpent(totalAmountSpentResult.data);
        const monthlyAmountSpentResult =
          await getMonthlyAmountSpentByUserId(userId);
        setMonthlyAmountSpent(monthlyAmountSpentResult.data);
        const monthlyChangePercentResult =
          await getMonthlyChangePercentByUserId(userId);
        setMonthlyChangePercent(monthlyChangePercentResult.data);
        // Fetch issues count
        const issuesResult = await getIssuesCountByUserId(userId);
        setIssuesCount(issuesResult.data);
        const mostOrderedItemResult = await getMostOrderedItemByUserId(userId);
        setMostOrderedItem(mostOrderedItemResult.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    if (!isPending && userId) {
      fetchDashboardData(userId);
    }
  }, [userId, isPending]);
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Monthly Amount Spent */}
      <Card className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-white via-neutral-50 to-neutral-100 p-2 shadow-sm transition-all hover:shadow-md dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <CardHeader className="mt-3">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <Badge variant="outline">Monthly Amount Spent</Badge>
          </CardDescription>
          <CardTitle className=" text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(monthlyAmountSpent)
            )}
          </CardTitle>
          {!loading && (
            <CardAction>
              <Badge
                variant="outline"
                className={
                  monthlyChangePercent >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {monthlyChangePercent >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
                {monthlyChangePercent >= 0 ? "+" : ""}
                {monthlyChangePercent.toFixed(1)}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex w-full items-center justify-between">
          <div className="flex flex-col text-sm">
            <span className="font-medium">
              {monthlyChangePercent >= 0 ? "Increased" : "Decreased"} from
              previous month
            </span>
            <span className="text-muted-foreground">Last 30 days spending</span>
          </div>
        </CardFooter>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
      </Card>

      {/* Card 2: Total Amount Spent */}
      <Card className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-white via-neutral-50 to-neutral-100 p-5 shadow-sm transition-all hover:shadow-md dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <Badge variant="outline">Total Amount Spent</Badge>
          </CardDescription>
          <CardTitle className="mt-1 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(totalAmountSpent)
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex w-full items-center justify-between">
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>Lifetime spending</span>
          </div>
        </CardFooter>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
      </Card>

      {/* Card 3: Most Ordered Item */}
      <Card className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-white via-neutral-50 to-neutral-100 p-5 shadow-sm transition-all hover:shadow-md dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <Badge variant="outline">Most Ordered Item</Badge>
          </CardDescription>

          <CardTitle className="mt-1 flex items-center gap-2 text-2xl font-semibold @[250px]/card:text-3xl">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold text-primary">
                  {mostOrderedItem?.day} - {mostOrderedItem?.mealTime}
                </h1>
                <p className="text-base ">{mostOrderedItem?.type}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {mostOrderedItem?.description}
                </p>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        {/* Subtle gradient highlight on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
      </Card>

      {/* Card 4: Issues Raised */}
      <Card className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-white via-neutral-50 to-neutral-100 p-5 shadow-sm transition-all hover:shadow-md dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <Badge variant="outline">Issues Raised</Badge>
          </CardDescription>
          <CardTitle className="mt-1 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              issuesCount
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex w-full items-center justify-between">
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>Total issues reported</span>
          </div>
        </CardFooter>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
      </Card>
    </div>
  );
}

export function SectionCardsAdmin() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const [todaysOrders, setTodaysOrders] = useState<number>(0);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(0);
  const [uniqueOrders, setUniqueOrders] = useState<number>(0);
  const [openIssuesCount, setOpenIssuesCount] = useState<number>(0);
  const [monthlyChangePercent, setMonthlyChangePercent] = useState<number>(0);
  const [dailyChangePercent, setDailyChangePercent] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async (userId: string) => {
      try {
        setLoading(true);

        const todaysOrdersResult = await getTodaysOrders();
        setTodaysOrders(todaysOrdersResult.data);
        const monthlyOrdersResult = await getMonthlyOrders();
        setMonthlyOrders(monthlyOrdersResult.data);
        const uniqueOrdersResult = await getTodaysUniqueOrders();
        setUniqueOrders(uniqueOrdersResult.data);
        const openIssuesCountResult = await getOpenIssuesCount();
        setOpenIssuesCount(openIssuesCountResult.data);
        const monthlyChangePercentResult = await getMonthlyChangePercent();
        setMonthlyChangePercent(monthlyChangePercentResult.data);
        const dailyChangePercentResult = await getDailyChangePercent();
        setDailyChangePercent(Number(dailyChangePercentResult.data.toFixed(1)));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    if (!isPending && userId) {
      fetchDashboardData(userId);
    }
  }, [isPending, userId]);
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Monthly Orders */}
      <Card className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-white via-neutral-50 to-neutral-100 p-2 shadow-sm transition-all hover:shadow-md dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <CardHeader className="mt-3">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <Badge variant="outline">Monthly Orders</Badge>
          </CardDescription>
          <CardTitle className=" text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(monthlyOrders)
            )}
          </CardTitle>
          {!loading && (
            <CardAction>
              <Badge
                variant="outline"
                className={
                  monthlyChangePercent >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {monthlyChangePercent >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
                {monthlyChangePercent >= 0 ? "+" : ""}
                {monthlyChangePercent.toFixed(1)}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex w-full items-center justify-between">
          <div className="flex flex-col text-sm">
            <span className="font-medium">
              {monthlyChangePercent >= 0 ? "Increased" : "Decreased"} from
              previous month
            </span>
            <span className="text-muted-foreground">Last 30 days orders</span>
          </div>
        </CardFooter>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
      </Card>

      {/* Card 2: Today's Orders */}
      <Card className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-white via-neutral-50 to-neutral-100 p-2 shadow-sm transition-all hover:shadow-md dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <CardHeader className="mt-3">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <Badge variant="outline">Today's Orders</Badge>
          </CardDescription>
          <CardTitle className=" text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(todaysOrders)
            )}
          </CardTitle>
          {!loading && (
            <CardAction>
              <Badge
                variant="outline"
                className={
                  dailyChangePercent >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {dailyChangePercent >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
                {dailyChangePercent >= 0 ? "+" : ""}
                {dailyChangePercent}%
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex w-full items-center justify-between">
          <div className="flex flex-col text-sm">
            <span className="font-medium">
              {dailyChangePercent >= 0 ? "Increased" : "Decreased"} from
              yesterday
            </span>
            <span className="text-muted-foreground">Today's total orders</span>
          </div>
        </CardFooter>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
      </Card>

      {/* Card 3: Unique Orders Today */}
      <Card className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-white via-neutral-50 to-neutral-100 p-5 shadow-sm transition-all hover:shadow-md dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <Badge variant="outline">Unique Orders Today</Badge>
          </CardDescription>
          <CardTitle className="mt-1 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              uniqueOrders
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex w-full items-center justify-between">
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>Unique users who ordered today</span>
          </div>
        </CardFooter>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
      </Card>

      {/* Card 4: Open Issues */}
      <Card className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-white via-neutral-50 to-neutral-100 p-5 shadow-sm transition-all hover:shadow-md dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <Badge variant="outline">Open Issues</Badge>
          </CardDescription>
          <CardTitle className="mt-1 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              openIssuesCount
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex w-full items-center justify-between">
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>Issues awaiting resolution</span>
          </div>
        </CardFooter>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
      </Card>
    </div>
  );
}
