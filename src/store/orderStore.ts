import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getOrders, updateOrder, deleteOrder } from "@/actions/order";

interface OrderStore {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  updateOrderInStore: (
    updatedOrder: Order,
    id: string
  ) => Promise<{ success: boolean; message: string }>;
  deleteOrderFromStore: (
    id: string
  ) => Promise<{ success: boolean; message: string }>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOrderStore = create<OrderStore>()(
  devtools((set, get) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async () => {
      set({ loading: true, error: null });
      try {
        const result = await getOrders();
        if (result.success && result.data) {
          set({ orders: result.data, loading: false });
        } else {
          set({ error: "Failed to fetch orders", loading: false });
        }
      } catch (error) {
        set({ error: "Failed to fetch orders", loading: false });
        console.error("Error fetching orders:", error);
      }
    },

    updateOrderInStore: async (updatedOrder: Order, id: string) => {
      try {
        const result = await updateOrder(updatedOrder);
        if (result.success) {
          set((state: OrderStore) => ({
            orders: state.orders.map((order) =>
              order.id === id ? { ...order, ...updatedOrder } : order
            ),
          }));
        }
        return result;
      } catch (error) {
        console.error("Error updating order:", error);
        return { success: false, message: "Failed to update order" };
      }
    },

    deleteOrderFromStore: async (id: string) => {
      try {
        const result = await deleteOrder(id);
        if (result.success) {
          set((state: OrderStore) => ({
            orders: state.orders.filter((o) => o.id !== id),
          }));
        }
        return result;
      } catch (error) {
        console.error("Error deleting order:", error);
        return { success: false, message: "Failed to delete order" };
      }
    },

    setLoading: (loading: boolean) => set({ loading }),

    setError: (error: string | null) => set({ error }),
  }))
);
