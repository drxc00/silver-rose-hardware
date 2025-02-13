"use server";

import { UTApi } from "uploadthing/server";

// Initilize the UploadThingAPI
const utapi = new UTApi();

export async function deleteFile(fileKey: string): Promise<{ success: boolean, message?: string }> {
    try {
        await utapi.deleteFiles(fileKey);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete file"
        };
    }
}