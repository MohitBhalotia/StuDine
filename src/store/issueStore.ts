import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import {
  addIssues,
  deleteIssues,
  getIssues,
  updateIssues,
} from "@/actions/issues";

interface IssueStore {
  issues: Issues[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchIssues: () => Promise<void>;
  addIssueToStore: (issue: Issues) => void;
  updateIssueInStore: (
    updatedIssue: Issues,
    id: string
  ) => Promise<{ success: boolean; message: string }>;
  deleteIssueFromStore: (
    id: string
  ) => Promise<{ success: boolean; message: string }>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useIssueStore = create<IssueStore>()(
  devtools((set) => ({
    issues: [],
    loading: false,
    error: null,

    fetchIssues: async () => {
      set({ loading: true, error: null });
      try {
        const result = await getIssues();
        if (result.success && result.data) {
          set({ issues: result.data, loading: false });
        } else {
          set({ error: "Failed to fetch issues", loading: false });
        }
      } catch (error) {
        set({ error: "Failed to fetch issues", loading: false });
        console.error("Error fetching issues:", error);
      }
    },

    addIssueToStore: async (issue: Issues) => {
      set({ loading: true, error: null });
      const result = await addIssues(issue);
      if (result.success) {
        set((state: IssueStore) => ({
          issues: [...state.issues, issue],
          loading: false,
        }));
        toast.success(result.message);
      } else {
        toast.error(result.message);
        set({ error: "Failed to add issue", loading: false });
      }
    },

    updateIssueInStore: async (updatedIssue: Issues, id: string) => {
      set({ loading: true, error: null });
      try {
        const result = await updateIssues(updatedIssue);
        if (result.success) {
          set((state: IssueStore) => ({
            issues: state.issues.map((issue) =>
              issue.id === id ? { ...issue, ...updatedIssue } : issue
            ),
            loading: false,
          }));
        }
        return result;
      } catch (error) {
        console.error("Error updating issue:", error);
        return { success: false, message: "Failed to update issue", loading: false };
      }
    },

    deleteIssueFromStore: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const result = await deleteIssues(id);
        if (result.success) {
          set((state: IssueStore) => ({
            issues: state.issues.filter((issue: Issues) => issue.id !== id),
            loading: false,
          }));
        }
        return result;
      } catch (error) {
        console.error("Error deleting issue:", error);
        return { success: false, message: "Failed to delete issue", loading: false };
      }
    },

    setLoading: (loading: boolean) => set({ loading }),

    setError: (error: string | null) => set({ error }),
  }))
);
