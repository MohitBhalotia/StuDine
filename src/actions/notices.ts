"use server";

import { db } from "@/config/db";

export const getNotices = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM notices WHERE validUntil IS NULL OR validUntil > NOW()");

    return {
      success: true,
      message: "Notices fetched successfully",
      data: rows as Notices[],
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get notices");
  }
};

export const addNotices = async (notices: Notices) => {
  try {
    await db.query(
      "INSERT INTO notices (id, title, description, image, postedBy, validUntil) VALUES (?, ?, ?, ?, ?, ?)",
      [
        notices.id,
        notices.title,
        notices.description,
        notices.image,
        notices.postedBy,
        notices.validUntil,
      ]
    );
    return { success: true, message: "Notices added successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add menu");
  }
};

export const updateNotices = async (notices: Notices) => {
  try {
    await db.query(
      "UPDATE notices SET  title = ?, description = ?, image = ?, postedBy = ?, validUntil = ? WHERE id = ?",
      [
        notices.title,
        notices.description,
        notices.image,
        notices.postedBy,
        notices.validUntil,
        notices.id,
      ]
    );
    return { success: true, message: "Notices updated successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update menu");
  }
};

export const deleteNotices = async (id: string) => {
  try {
    await db.query("DELETE FROM notices WHERE id = ?", [id]);
    return { success: true, message: "Notices deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete notices");
  }
};



