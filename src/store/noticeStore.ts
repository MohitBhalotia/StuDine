import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import {
  addNotices,
  deleteNotices,
  getNotices,
  updateNotices,
} from "@/actions/notices";

interface NoticeStore {
  notices: Notices[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchNotices: () => Promise<void>;
  addNoticeToStore: (notice: Notices) => void;
  updateNoticeInStore: (
    updatedNotice: Notices,
    id: string
  ) => Promise<{ success: boolean; message: string }>;
  deleteNoticeFromStore: (
    id: string
  ) => Promise<{ success: boolean; message: string }>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNoticeStore = create<NoticeStore>()(
  devtools((set) => ({
    notices: [],
    loading: false,
    error: null,

    fetchNotices: async () => {
      set({ loading: true, error: null });
      try {
        const result = await getNotices();
        if (result.success && result.data) {
          set({ notices: result.data, loading: false });
        } else {
          set({ error: "Failed to fetch notices", loading: false });
        }
      } catch (error) {
        set({ error: "Failed to fetch notices", loading: false });
        console.error("Error fetching notices:", error);
      }
    },

    addNoticeToStore: async (notice: Notices) => {
      set({ loading: true, error: null });
      const result = await addNotices(notice);
      if (result.success) {
        set((state: NoticeStore) => ({
          notices: [...state.notices, notice],
          loading: false,
        }));
        toast.success(result.message);
      } else {
        toast.error(result.message);
        set({ error: "Failed to add notice", loading: false });
      }
    },

    updateNoticeInStore: async (updatedNotice: Notices, id: string) => {
      try {
        const result = await updateNotices(updatedNotice);
        if (result.success) {
          set((state: NoticeStore) => ({
            notices: state.notices.map((notice) =>
              notice.id === id ? { ...notice, ...updatedNotice } : notice
            ),
          }));
        }
        return result;
      } catch (error) {
        console.error("Error updating notice:", error);
        return { success: false, message: "Failed to update notice" };
      }
    },

    deleteNoticeFromStore: async (id: string) => {
      try {
        const result = await deleteNotices(id);
        if (result.success) {
          set((state: NoticeStore) => ({
            notices: state.notices.filter(
              (notice: Notices) => notice.id !== id
            ),
          }));
        }
        return result;
      } catch (error) {
        console.error("Error deleting notice:", error);
        return { success: false, message: "Failed to delete notice" };
      }
    },

    setLoading: (loading: boolean) => set({ loading }),

    setError: (error: string | null) => set({ error }),
  }))
);
