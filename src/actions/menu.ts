"use server";

import { db } from "@/config/db";

export const getMenus = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM menus ORDER BY createdAt ASC");
    return { success: true,message: "Menu fetched successfully", data: rows as Menu[] };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get menu");
  }
};

export const addMenu = async (menu: Menu) => {
  try {
    console.log(menu);
    await db.query(
      "INSERT INTO menus (id, description, type, mealTime, day, price, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        menu.id,
        menu.description,
        menu.type,
        menu.mealTime,
        menu.day,
        menu.price,
        menu.image ?? null,
      ]
    );
    return { success: true, message: "Menu added successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add menu");
  }
};

export const updateMenu = async (menu: Menu) => {
  try {
    await db.query(
      "UPDATE menus SET  description = ?, price = ? , type = ?, mealTime = ?, day = ?, image = ? WHERE id = ?",
      [
        menu.description,
        menu.price,
        menu.type,
        menu.mealTime,
        menu.day,
        menu.image,
        menu.id,
      ]
    );
    return { success: true, message: "Menu updated successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update menu");
  }
};

export const deleteMenu = async (id: string) => {
  try {
    await db.query("DELETE FROM menus WHERE id = ?", [id]);
    return { success: true, message: "Menu deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete menu");
  }
};

export const getMenuById = async (id: string) => {
  try {
    const [rows] = await db.query("SELECT * FROM menus WHERE id = ?", [id]);
    return { success: true, message: "Menu fetched successfully", data: rows as Menu[]};
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get menu");
  }
};