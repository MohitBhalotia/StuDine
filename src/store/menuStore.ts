import { create } from "zustand";
import { getMenus, deleteMenu, addMenu, updateMenu } from "@/actions/menu";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
interface MenuStore {
  menus: Menu[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchMenus: () => Promise<void>;
  addMenuToStore: (menu: Menu) => void;
  updateMenuInStore: (id: string, menu: Menu) => Promise<void>;
  deleteMenuFromStore: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMenuStore = create<MenuStore>()(
  devtools((set) => ({
    menus: [],
    loading: false,
    error: null,

    fetchMenus: async () => {
      set({ loading: true, error: null });
      try {
        const menus = await getMenus();
        set({ menus: menus.data, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch menus", loading: false });
        console.error("Error fetching menus:", error);
      }
    },

    addMenuToStore: async (menu: Menu) => {
      const result = await addMenu(menu);
      if (result.success) {
        set((state: MenuStore) => ({
          menus: [...state.menus, menu],
        }));
        toast.success(result.message);
      } else {
        toast.error(result.message);
        set({ error: "Failed to add menu" });
      }
    },

    updateMenuInStore: async (id: string, updatedMenu: Menu) => {
      const result = await updateMenu(updatedMenu);
      if (result.success) {
        set((state: MenuStore) => ({
          menus: state.menus.map((menu) =>
            menu.id === id ? { ...menu, ...updatedMenu } : menu
          ),
        }));
      } else {
        set({ error: "Failed to update menu" });
      }
    },

    deleteMenuFromStore: async (id: string) => {
      try {
        await deleteMenu(id);
        set((state) => ({
          menus: state.menus.filter((menu: Menu) => menu.id !== id),
        }));
      } catch (error) {
        console.error("Error deleting menu:", error);
        set({ error: "Failed to delete menu" });
      }
    },

    setLoading: (loading: boolean) => set({ loading }),

    setError: (error: string | null) => set({ error }),
  }))
);
