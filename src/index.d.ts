export declare global {
  interface Menu {
    id: string;
    description: string;
    type: "Veg" | "Non-veg" | "Jain";
    mealTime: "Breakfast" | "Lunch" | "Snacks" | "Dinner";
    day:
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
      | "Sunday";
    price: number;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface Order {
    id: string;
    userId: string;
    menuId: string;
    orderTime: Date;
    quantity: number;
    specialRequest?: string;
    status: "Pending" | "Confirmed" | "Delivered" | "Cancelled";
    paymentStatus: "Paid" | "Unpaid" | "Refunded";
    paymentMethod: "Cash" | "Card" | "Online";
    totalAmount: number;
  }
  interface Notices {
    id: string;
    title: string;
    content: string;
    image?: string;
    postedBy: string;
    postedAt: Date;
    validUntil: Date;
  }

  interface Issues {
    id: string;
    userId: string;
    title: string;
    description: string;
    image?: string;
    status: "Open" | "Resolved" | "Progress" | "Hold";
    createdAt: Date;
    updatedAt: Date;
  }
}
