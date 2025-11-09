"use server";

import { db } from "@/config/db";

export const getOrders = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM orders");
    return {
      success: true,
      message: "Orders fetched successfully",
      data: rows as Order[],
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get menu");
  }
};

export const addOrder = async (order: Order) => {
  try {
    console.log(order);
    await db.query(
      "INSERT INTO orders (id, menuId, userId, quantity, totalAmount, status,paymentStatus,paymentMethod,specialRequest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        order.id,
        order.menuId,
        order.userId,
        order.quantity,
        order.totalAmount,
        "Pending",
        "Unpaid",
        order.paymentMethod,
        order.specialRequest,
      ]
    );
    return { success: true, message: "Menu added successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add menu");
  }
};

export const updateOrder = async (order: Order) => {
  try {
    await db.query(
      "UPDATE orders SET  quantity = ?, totalAmount = ?, status = ?, paymentStatus = ?, paymentMethod = ?, specialRequest = ? WHERE id = ?",
      [
        order.quantity,
        order.totalAmount,
        order.status,
        order.paymentStatus,
        order.paymentMethod,
        order.specialRequest,
        order.id,
      ]
    );
    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update menu");
  }
};

export const deleteMenu = async (id: string) => {
  try {
    await db.query("DELETE FROM orders WHERE id = ?", [id]);
    return { success: true, message: "Menu deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete menu");
  }
};
