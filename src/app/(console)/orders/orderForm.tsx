"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { orderformSchema } from "@/models/console/order-schema";
import { getMenuById } from "@/actions/menu";
import { useMenuStore } from "@/store/menuStore";
import { createAuthClient } from "better-auth/react";
import { User } from "@/lib/auth";
import { SlideToBuyButton } from "@/components/SlideButton";
import { Loader2 } from "lucide-react";
import { addOrder } from "@/actions/order";
import { toast } from "sonner";

const { useSession } = createAuthClient();

export function OrderForm({ id }: { id?: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { data: session, isPending: sessionLoading } = useSession();
  const { loading: menuLoading, fetchMenus, menus } = useMenuStore();
  const [menu, setMenu] = useState<Menu | undefined>(undefined);
  const [pending, setPending] = useState(false);

  // ✅ Initialize form
  const form = useForm<z.infer<typeof orderformSchema>>({
    resolver: zodResolver(orderformSchema),
    defaultValues: {
      userId: undefined,
      menuId: id ?? undefined,
      quantity: 1,
      specialRequest: "",
      status: "Pending" as const,
      paymentStatus: "Unpaid" as const,
      paymentMethod: "Cash" as const,
      totalAmount: 0,
    },
  });

  // ✅ Fetch menus on mount
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // ✅ Update user when session changes
  useEffect(() => {
    if (session?.user && !sessionLoading) {
      const currentUser = session.user as User;
      setUser(currentUser);
      form.setValue("userId", currentUser.id);
    }
  }, [session, sessionLoading, form]);

  // ✅ Fetch menu when `id` is passed
  useEffect(() => {
    const fetchMenu = async () => {
      if (id) {
        const result = await getMenuById(id);
        if (result.success && result.data?.length) {
          const fetchedMenu = result.data[0] as Menu;
          setMenu(fetchedMenu);
          form.setValue("menuId", fetchedMenu.id);
          form.setValue("totalAmount", Number(fetchedMenu.price));
        }
      }
    };
    fetchMenu();
  }, [id, form]);

  // ✅ Auto-update total when quantity changes
  const quantity = form.watch("quantity");
  useEffect(() => {
    if (menu?.price) {
      form.setValue("totalAmount", Number(menu.price) * quantity);
    }
  }, [quantity, menu?.price, form]);

  // ✅ Submit handler
  const handleSubmit = form.handleSubmit(async (data) => {
    setPending(true);
    try {
      const result = await addOrder(data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      router.push("/orders");
    } catch (err) {
      console.error("Error placing order:", err);
    } finally {
      form.reset();
      setPending(false);
    }
  });

  if (menuLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto border rounded-2xl p-6 shadow-sm space-y-6 bg-background">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
          {/* Menu display or selection */}
          {menu ? (
            <div className="flex items-center gap-4">
              {menu.image && (
                <Image
                  src={menu.image}
                  alt={menu.description}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover border"
                />
              )}
              <div>
                <h1 className="text-xl font-semibold">{menu.description}</h1>
                <p className="text-sm text-muted-foreground">₹{menu.price}</p>
              </div>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="menuId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Menu</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selected = menus.find((m) => m.id === value);
                      setMenu(selected);
                      form.setValue(
                        "totalAmount",
                        selected ? Number(selected.price) : 0
                      );
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a menu item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {menus.length > 0 ? (
                        menus.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground truncate">
                                {m.description} - ₹{m.price}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {m.day} • {m.mealTime} • {m.type}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        
                        <p className="text-sm text-muted-foreground p-2">No menus available</p>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Special request */}
          <FormField
            control={form.control}
            name="specialRequest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Request</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Any custom instructions?" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total amount */}
          {menu && (
            <div className="flex justify-between text-sm text-muted-foreground border-t pt-3">
              <span>Total Amount</span>
              <span className="font-semibold text-foreground">
                ₹{form.watch("totalAmount")}
              </span>
            </div>
          )}

          {/* Submit button */}
          <SlideToBuyButton
            onConfirm={handleSubmit}
            disabled={pending || sessionLoading}
            text="Place Order"
          />
        </form>
      </Form>
    </div>
  );
}
