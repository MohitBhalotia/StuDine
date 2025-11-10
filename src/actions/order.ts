"use server";

import { db } from "@/config/db";
import { v4 as uuidv4 } from "uuid";
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
      "INSERT INTO orders (id, menuId, userId, quantity, totalAmount, status,paymentStatus,paymentMethod,specialRequest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        uuidv4(),
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
    return { success: true, message: "Order placed successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to place order");
  }
};

export const updateOrder = async (order: Order) => {
  try {
    await db.query(
      "UPDATE orders SET quantity = ?, totalAmount = ?, status = ?, paymentStatus = ?, paymentMethod = ?, specialRequest = ? WHERE id = ?",
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
    throw new Error("Failed to update order");
  }
};

export const deleteOrder = async (id: string) => {
  try {
    await db.query("DELETE FROM orders WHERE id = ?", [id]);
    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete order");
  }
};
