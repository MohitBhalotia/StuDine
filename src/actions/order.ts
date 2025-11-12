"use server";

import { db } from "@/config/db";
import { cache } from "react";
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

export const getOrdersByUserId = async (userId: string) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders WHERE userId = ?", [
      userId,
    ]);
    return {
      success: true,
      message: "Orders fetched successfully",
      data: rows as Order[],
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get order");
  }
};

export const getOrdersWithMenuByUserId = cache(async (userId: string) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        o.*, 
        m.mealTime, 
        m.description, 
        m.type, 
        m.day 
      FROM orders o 
      LEFT JOIN menus m ON o.menuId = m.id 
      WHERE o.userId = ?
      ORDER BY o.orderTime DESC`,
      [userId]
    );
    return {
      success: true,
      message: "Orders with menu data fetched successfully",
      data: rows as (Order & {
        mealTime?: string;
        description?: string;
        type?: string;
        day?: string;
      })[],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to get orders",
      data: [],
    };
  }
});

export const getTotalAmountSpentByUserId = async (userId: string) => {
  try {
    const [rows]: any = await db.query(
      "SELECT SUM(totalAmount) AS total FROM orders WHERE userId = ?",
      [userId]
    );
    const total = rows[0]?.total ?? 0;
    return {
      success: true,
      message: "Total amount spent fetched successfully",
      data: total,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get total amount spent");
  }
};
export const getMonthlyAmountSpentByUserId = async (userId: string) => {
  try {
    const [rows]: any = await db.query(
      "SELECT SUM(totalAmount) AS total FROM orders WHERE userId = ? AND MONTH(orderTime) = MONTH(CURRENT_DATE())",
      [userId]
    );
    const total = rows[0]?.total ?? 0;
    return {
      success: true,
      message: "Monthly amount spent fetched successfully",
      data: total,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get monthly amount spent");
  }
};

export const getMonthlyChangePercentByUserId = async (userId: string) => {
  try {
    const [rows]: any = await db.query(
      "SELECT SUM(totalAmount) AS total FROM orders WHERE userId = ? AND orderTime >= DATE_FORMAT(CURRENT_DATE() - INTERVAL 1 MONTH, '%Y-%m-01')  AND orderTime < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01');",
      [userId]
    );

    const previousMonthTotal = rows[0]?.total ?? 0;
    const currentMonthTotal = await getMonthlyAmountSpentByUserId(userId);
    const changePercent =
      ((currentMonthTotal.data - previousMonthTotal) /
        (Number(previousMonthTotal) === 0 ? 1 : Number(previousMonthTotal))) *
      100;
    return {
      success: true,
      message: "Monthly change percent fetched successfully",
      data: changePercent,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get monthly change percent");
  }
};

export const getMostOrderedItemByUserId = async (userId: string) => {
  try {
    const [rows]: any = await db.query(
      `
      SELECT m.*, SUM(o.totalAmount) AS total
      FROM orders o
      JOIN menus m ON o.menuId = m.id
      WHERE o.userId = ?
      GROUP BY o.menuId
      ORDER BY total DESC
      LIMIT 1
      `,
      [userId]
    );
    return {
      success: true,
      message: "Most ordered item fetched successfully",
      data: rows[0] as Menu,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get most ordered item");
  }
};

export const getTodaysOrders = async () => {
  try {
    const [rows]: any = await db.query(
      "SELECT SUM(totalAmount) AS total FROM orders WHERE orderTime >= CURDATE() AND orderTime < CURDATE() + INTERVAL 1 DAY"
    );
    return {
      success: true,
      message: "Todays orders fetched successfully",
      data: rows[0]?.total ?? 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get todays orders");
  }
};

export const getMonthlyOrders = async () => {
  try {
    const [rows]: any = await db.query(
      "SELECT SUM(totalAmount) AS total FROM orders WHERE MONTH(orderTime) = MONTH(CURRENT_DATE()) AND YEAR(orderTime) = YEAR(CURRENT_DATE())"
    );
    return {
      success: true,
      message: "Total orders fetched successfully",
      data: rows[0]?.total ?? 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get total orders");
  }
};

export const getMonthlyChangePercent = async () => {
  try {
    const [rows]: any = await db.query(
      "SELECT SUM(totalAmount) AS total FROM orders WHERE orderTime >= DATE_FORMAT(CURRENT_DATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND orderTime < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01');"
    );

    const previousMonthTotal = rows[0]?.total ?? 0;
    const currentMonthTotal = await getMonthlyOrders();
    const changePercent =
      ((currentMonthTotal.data - previousMonthTotal) /
        (Number(previousMonthTotal) === 0 ? 1 : Number(previousMonthTotal))) *
      100;
    return {
      success: true,
      message: "Monthly change percent fetched successfully",
      data: changePercent,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get monthly change percent");
  }
};

export const getTodaysUniqueOrders = async () => {
  try {
    const [rows]: any = await db.query(
      "SELECT COUNT(DISTINCT userId) AS count FROM orders WHERE orderTime >= CURDATE() AND orderTime < CURDATE() + INTERVAL 1 DAY"
    );
    return {
      success: true,
      message: "Unique orders fetched successfully",
      data: rows[0]?.count ?? 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get unique orders");
  }
};

export const getOpenIssuesCount = async () => {
  try {
    const [rows]: any = await db.query(
      "SELECT COUNT(*) AS count FROM issues WHERE status = 'Open'"
    );
    return {
      success: true,
      message: "Open issues count fetched successfully",
      data: rows[0]?.count ?? 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get open issues count");
  }
};

export const getDailyChangePercent = async () => {
  try {
    const [rows]: any = await db.query(
      "SELECT SUM(totalAmount) AS total FROM orders WHERE DATE(orderTime) = CURDATE()-INTERVAL 1 DAY;"
    );
    const previousDayTotal = rows[0]?.total ?? 0;
    const currentDayTotal = await getTodaysOrders();
    const changePercent =
      ((currentDayTotal.data - previousDayTotal) /
        (Number(previousDayTotal) === 0 ? 1 : Number(previousDayTotal))) *
      100;
    console.log("rows", rows);
    return {
      success: true,
      message: "Daily change percent fetched successfully",
      data: changePercent ?? 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get daily change percent");
  }
};

export const getOrdersWithMenu = async (userId: string) => {
  try {
    const [rows]: any = await db.query(
      `SELECT 
        o.*, 
        m.mealTime, 
        m.description, 
        m.type, 
        m.day 
      FROM orders o 
      LEFT JOIN menus m ON o.menuId = m.id 
      ORDER BY o.orderTime DESC`
    );

  
    return {
      success: true,
      message: "Orders with menu data fetched successfully",
      data: rows as (Order & {
        mealTime?: string;
        description?: string;
        type?: string;
        day?: string;
      })[],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to get orders",
      data: [],
    };
  }
};

