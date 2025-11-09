"use server";
import cloudinaryClient from "@/config/cloudinary";
import { v2 as cloudinary } from "cloudinary";
export const uploadToCloudinary = async (base64: string) => {
  await cloudinaryClient();
  const result = await cloudinary.uploader.upload(base64, {
    resource_type: "image",
    folder: "menu_images",
  });
  return result;
};
