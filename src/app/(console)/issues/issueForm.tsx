"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Slider } from "@/components/ui/slider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import Image from "next/image";
import { InfoIcon, Loader2, TrashIcon } from "lucide-react";
import { issueformSchema } from "@/models/console/issue-schema";
import { createAuthClient } from "better-auth/react";
import { User } from "better-auth";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { useIssueStore } from "@/store/issueStore";
import { toast } from "sonner";
const { useSession } = createAuthClient();

export function IssueForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const { addIssueToStore, loading } = useIssueStore();
  const form = useForm<z.infer<typeof issueformSchema>>({
    resolver: zodResolver(issueformSchema),
    defaultValues: {
      userId: "",
      title: "Enter title",
      description: "Enter description",
      image: undefined,
    },
  });

  useEffect(() => {
    if (session?.user && !isPending) {
      const currentUser = session.user as User;
      setUser(currentUser);
      form.setValue("userId", currentUser.id);
    }
  }, [session, isPending, form]);

  const [files, setFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true);
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
      }
      const issueData = {
        id: uuidv4(),
        userId: data.userId,
        title: data.title,
        description: data.description,
        image: imageUrl,
      };
      await addIssueToStore(issueData);

      router.push("/notices");
      toast.success("Notice posted successfully");
      form.reset();
      setFiles([]);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to post notice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  });

  const handleDrop = (files: File[]) => {
    console.log(files);
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

  return (
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter title" />
              </FormControl>
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

        {/* ✅ Submit */}
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading || isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />{" "}
                <span>Submitting...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
