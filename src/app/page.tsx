import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Utensils,
  QrCode,
  Bell,
  AlertCircle,
  TrendingUp,
  Clock,
  Shield,
  Sparkles,
  ChevronRight,
  Menu as MenuIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className=" flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 p-2 ">
            <Image
              src="/logo.png"
              alt="Studine Logo"
              width={160}
              height={100}
              className="rounded-md"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container relative overflow-hidden px-4 py-20 md:px-6 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            Simplify Your Hostel Dining
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Smart Meal Management
            <br />
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              For IIIT Nagpur
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Streamline meal orders, track spending, manage menus, and handle
            issues—all in one powerful platform designed for students and hostel
            administrators.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center mt-10  pt-16 flex-col bg-background">
          <Image
            src="/iiitn.png"
            alt="Studine Logo"
            width={160}
            height={100}
            className="rounded-md"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 pt-8 pb-20 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features to manage your hostel dining experience
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group relative overflow-hidden border bg-linear-to-br from-white via-neutral-50 to-neutral-100 transition-all hover:shadow-lg dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Digital Menu Management</CardTitle>
                <CardDescription>
                  Browse weekly menus with meal types, prices, and images. Know
                  what's cooking before you order.
                </CardDescription>
              </CardHeader>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-primary/5 to-transparent" />
            </Card>

            {/* Feature 2 */}
            <Card className="group relative overflow-hidden border bg-linear-to-br from-white via-neutral-50 to-neutral-100 transition-all hover:shadow-lg dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Order Tracking</CardTitle>
                <CardDescription>
                  Place orders easily, track status in real-time, and manage
                  payment methods with full transparency.
                </CardDescription>
              </CardHeader>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-green-500/5 to-transparent" />
            </Card>

            {/* Feature 3 */}
            <Card className="group relative overflow-hidden border bg-linear-to-br from-white via-neutral-50 to-neutral-100 transition-all hover:shadow-lg dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <QrCode className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>QR Code Access</CardTitle>
                <CardDescription>
                  Generate and scan QR codes for quick menu access and seamless
                  ordering experience.
                </CardDescription>
              </CardHeader>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-blue-500/5 to-transparent" />
            </Card>

            {/* Feature 4 */}
            <Card className="group relative overflow-hidden border bg-linear-to-br from-white via-neutral-50 to-neutral-100 transition-all hover:shadow-lg dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track spending, view order history, and get insights with
                  beautiful charts and statistics.
                </CardDescription>
              </CardHeader>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-purple-500/5 to-transparent" />
            </Card>

            {/* Feature 5 */}
            <Card className="group relative overflow-hidden border bg-linear-to-br from-white via-neutral-50 to-neutral-100 transition-all hover:shadow-lg dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Issue Reporting</CardTitle>
                <CardDescription>
                  Report and track dining issues with status updates. Stay
                  informed about resolution progress.
                </CardDescription>
              </CardHeader>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-orange-500/5 to-transparent" />
            </Card>

            {/* Feature 6 */}
            <Card className="group relative overflow-hidden border bg-linear-to-br from-white via-neutral-50 to-neutral-100 transition-all hover:shadow-lg dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                  <Bell className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Notice Board</CardTitle>
                <CardDescription>
                  Stay updated with important announcements, menu changes, and
                  hostel notifications in one place.
                </CardDescription>
              </CardHeader>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-r from-pink-500/5 to-transparent" />
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-y bg-muted/50 px-4 py-20 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account with your hostel details and email
                verification
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Browse Menu</h3>
              <p className="text-muted-foreground">
                Check daily menus by meal time and select your preferred items
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Place Orders</h3>
              <p className="text-muted-foreground">
                Order meals, track delivery, and manage your spending
                effortlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Transform Your Dining Experience?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join hundreds of students already using Studine for hassle-free meal
            management
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Sign Up Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Studine Logo"
                  width={160}
                  height={100}
                  className="rounded-md"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Smart meal management for modern hostels
              </p>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/menu" className="hover:text-foreground">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-foreground">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/issues" className="hover:text-foreground">
                    Report Issue
                  </Link>
                </li>
                <li>
                  <Link href="/notices" className="hover:text-foreground">
                    Notices
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="hover:text-foreground">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Studine. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
