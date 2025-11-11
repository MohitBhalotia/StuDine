"use server";

import { db } from "@/config/db";

export const getIssues = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM issues");
    return {
      success: true,
      message: "Issues fetched successfully",
      data: rows as Issues[],
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get issues");
  }
};

export const addIssues = async (issues: Issues) => {
  try {
    console.log(issues);
    await db.query(
      "INSERT INTO issues (id, userId, title, description, image) VALUES (?, ?, ?, ?, ?)",
      [issues.id, issues.userId, issues.title, issues.description, issues.image]
    );
    return { success: true, message: "Issues added successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add issues");
  }
};

export const updateIssues = async (issues: Issues) => {
  try {
    await db.query(
      "UPDATE issues SET  userId = ?, title = ?, description = ?, image = ?, status = ? WHERE id = ?",
      [
        issues.userId,
        issues.title,
        issues.description,
        issues.image,
        issues.status,
        issues.id,
      ]
    );
    return { success: true, message: "Issues updated successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update issues");
  }
};

export const deleteIssues = async (id: string) => {
  try {
    await db.query("DELETE FROM issues WHERE id = ?", [id]);
    return { success: true, message: "Issues deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete issues");
  }
};
