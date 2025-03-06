"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";
import Image from "next/image";
import { deleteFile } from "@/app/(server)/actions/uploadthing-actions"; // Your server action
import { Button } from "@/components/ui/button";

export function ImageUpload({ image, form }: { image?: string; form: any }) {
  const [imageData, setImageData] = useState<{
    url: string;
    key: string;
  } | null>(
    image
      ? {
          url: image,
          key: image.split("/").pop() || "",
        }
      : null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    if (imageData?.key) {
      setIsDeleting(true);
      try {
        await deleteFile(imageData.key);
        setImageData(null);
        form.setValue("image", "");
      } catch (error) {
        console.error("Failed to delete image:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="rounded-sm shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Media</CardTitle>
      </CardHeader>
      <CardContent>
        {imageData ? (
          <div className="bg-sidebar border-2 border-dashed rounded-sm flex items-center justify-center h-64 relative">
            <Image
              src={imageData.url}
              alt="Uploaded Image"
              width={500}
              height={256}
              priority
              className={`object-cover rounded-sm h-full w-full ${
                isDeleting ? "opacity-50" : ""
              }`}
            />
            {isDeleting && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-xl">Deleting...</div>
              </div>
            )}
            {!isDeleting && (
              <Button
                onClick={handleRemove}
                className="absolute top-2 right-2"
                disabled={isDeleting}
              >
                Delete
              </Button>
            )}
          </div>
        ) : (
          <UploadDropzone
            className="bg-sidebar border-2 border-dashed rounded-lg flex items-center justify-center"
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                setImageData({
                  url: res[0].url,
                  key: res[0].key,
                });
                form.setValue("image", res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            config={{ mode: "auto" }}
            appearance={{
              button: "bg-primary cursor-pointer",
              label: "text-muted-foreground hover:text-primary",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
