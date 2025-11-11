"use client";

import * as z from "zod";
import { menuformSchema } from "@/models/console/menu-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "../../../components/dropzone";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useMenuStore } from "@/store/menuStore";
import Image from "next/image";
import { InfoIcon, Loader2, TrashIcon } from "lucide-react";

export function MenuForm({ id }: { id?: string }) {
  const router = useRouter();
  const { loading, addMenuToStore, updateMenuInStore, menus, fetchMenus } =
    useMenuStore();
  const [pending, setPending] = useState(false);
  const menu = menus.find((m) => m.id === id);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    if (!loading && menu) {
      form.reset(defaultValues);
      setFilePreview(menu.image ?? undefined);
    }
  }, [menu, loading]);
  const defaultValues = {
    description: menu?.description ?? "Roti, Sabji and Dal ",
    type: menu?.type ?? "Veg",
    mealTime: menu?.mealTime ?? "Breakfast",
    day: menu?.day ?? "Monday",
    price: menu?.price ? Number(menu.price) : 50,
  };

  const form = useForm<z.infer<typeof menuformSchema>>({
    resolver: zodResolver(menuformSchema),
    defaultValues: defaultValues,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string | undefined>(
    menu?.image ?? undefined
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setPending(true);
      let imageUrl = undefined;
      if (files.length > 0 || data.image) {
        const file = files[0];
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });

        const result = await uploadToCloudinary(base64);
        imageUrl = result.secure_url;
      } else if (data.image === undefined) {
        imageUrl = undefined;
      }

      const menuData = {
        id: id ?? uuidv4(),
        description: data.description,
        type: data.type,
        mealTime: data.mealTime,
        day: data.day,
        price: data.price,
        image: imageUrl,
      };

      if (menu) {
        await updateMenuInStore(menu.id, menuData);
      } else {
        await addMenuToStore(menuData);
      }

      router.push("/menu");
      form.reset();
      setFiles([]);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setPending(false);
    }
  });

  const handleDrop = (files: File[]) => {
    setFiles(files);
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setFilePreview(e.target?.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }
  return (
    <div className="p-4 border rounded-2xl mt-4">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
          {/* ✅ Image Section */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>

                {/* Dropzone Section */}
                <div className="flex flex-col gap-2">
                  <Dropzone
                    accept={{ "image/*": [] }}
                    src={files}
                    maxFiles={1}
                    onDrop={handleDrop}
                    onError={console.error}
                  >
                    <DropzoneEmptyState />
                    <DropzoneContent>
                      {filePreview && (
                        <div className="h-[150px] w-full">
                          <Image
                            alt="Preview"
                            className="absolute top-0 left-0 h-full w-full object-cover"
                            src={filePreview}
                            width={200}
                            height={200}
                          />
                        </div>
                      )}
                    </DropzoneContent>
                  </Dropzone>

                  {filePreview && (
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <InfoIcon className="h-4 w-4" /> Click on the image to
                        change it
                      </p>
                      <Button
                        className=""
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          setFiles([]);
                          setFilePreview(undefined);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete Image
                      </Button>
                    </div>
                  )}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* ✅ Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter meal description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ✅ Day, Meal Time, Type */}
          <div className="flex flex-wrap gap-2">
            {/* Day */}
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Day *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meal Time */}
            <FormField
              control={form.control}
              name="mealTime"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Meal Time *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal time" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Breakfast", "Lunch", "Snacks", "Dinner"].map(
                          (time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Type *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Veg", "Non-veg", "Jain"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ✅ Price Slider */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex w-full items-center justify-between">
                    <p>Price *</p>
                    <span className="text-base font-medium">
                      ₹{field.value}
                    </span>
                  </div>
                </FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(val) => field.onChange(val[0])}
                    min={0}
                    max={200}
                    step={5}
                  />
                </FormControl>
                <FormDescription>Set the price of the meal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ✅ Submit */}
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={loading}>
              {loading || pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />{" "}
                  <span>Submitting...</span>
                </>
              ) : menu ? (
                "Update Menu"
              ) : (
                "Add Menu"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
