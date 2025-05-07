import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Define profile image uploader that accepts image files
  profileImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Get user from auth
      const session = await auth();
      
      // Ensure user is authenticated
      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }
      
      // Pass user ID for use in onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs after upload completes
      console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Return file data to the client
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  // Gallery images uploader - allows multiple images
  galleryImages: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      // Get user from auth
      const session = await auth();
      
      // Ensure user is authenticated
      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }
      
      // Pass user ID for use in onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs after upload completes
      console.log("Gallery image upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Return file data to the client
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 