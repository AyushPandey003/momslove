"use client";

import { UploadButton, UploadDropzone, Uploader } from "@uploadthing/react";

export const UTUploadButton = UploadButton;
export const UTUploadDropzone = UploadDropzone;
export const UTUploader = Uploader;

export default function UploadthingProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 