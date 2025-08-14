"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { Label } from "./label";
import { Input } from "./input";
import { baseUrl } from "../../../config";

interface ImageUploadProps {
  disabled?: boolean;
  multiple?: boolean;
  onChange: (value: string[] | string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

interface UploadingFile {
  file: File;
  progress: number;
  tempId: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  multiple = true,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [images, setImages] = useState<string[]>(value || []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setImages(value || []);
  }, [value]);

  const uploadFile = useCallback(
    async (file: File, tempId: string) => {
      const formData = new FormData();
      formData.append("files", file);

      try {
        const response = await axios.post(
          `${baseUrl}/upload/assets`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setUploadingFiles((prev) =>
                  prev.map((f) =>
                    f.tempId === tempId ? { ...f, progress } : f
                  )
                );
              }
            },
          }
        );

        const uploadedFiles = response.data.data;
        const uploadedUrl = uploadedFiles[0]?.url;

        if (multiple) {
          setImages((prev) => {
            const updated = [...prev, uploadedUrl];
            onChange(updated);
            return updated;
          });
        } else {
          setImages([uploadedUrl]);
          onChange(uploadedUrl);
        }
      } catch (error) {
        console.error("File upload failed", error);
      } finally {
        setUploadingFiles((prev) => prev.filter((f) => f.tempId !== tempId));
      }
    },
    [multiple, onChange]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      if (!multiple || files.length === 0) {
        setUploadingFiles([]);
        setImages([]);
        onChange(multiple ? [] : "");

        const file = files[0];
        const tempId = `${file.name}-${Date.now()}`;
        setUploadingFiles([{ file, progress: 0, tempId }]);
        uploadFile(file, tempId);
      } else {
        Array.from(files).forEach((file) => {
          const tempId = `${file.name}-${Date.now()}-${Math.random()}`;
          setUploadingFiles((prev) => [...prev, { file, progress: 0, tempId }]);
          uploadFile(file, tempId);
        });
      }

      event.target.value = "";
    },
    [multiple, onChange, uploadFile]
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Uploaded files */}
      <div className="flex items-center flex-wrap gap-4">
        {images.map((url) => (
          <div
            key={url}
            className="relative w-[150px] h-[150px] rounded-lg overflow-hidden border"
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => {
                  const filtered = images.filter((img) => img !== url);
                  setImages(filtered);
                  onChange(filtered);
                  onRemove(url);
                }}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              alt="upload"
              fill
              style={{ objectFit: "cover" }}
              src={`${url}?tr=w-150,h-150`}
            />
          </div>
        ))}
      </div>

      {/* Uploading files */}
      {uploadingFiles.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {uploadingFiles.map((uf) => (
            <div
              key={uf.tempId}
              className="w-[150px] h-[150px] flex flex-col items-center justify-center border rounded-lg overflow-hidden"
            >
              <p className="text-xs truncate">{uf.file.name}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${uf.progress}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1">{uf.progress}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <Button type="button" disabled={disabled} className="w-fit">
        <Label className="cursor-pointer flex items-center">
          <ImagePlus className="h-4 w-4 mr-2" />
          {multiple ? "Upload Files" : "Upload file"}
          <Input
            type="file"
            multiple={multiple}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,application/pdf"
          />
        </Label>
      </Button>
    </div>
  );
};

export default ImageUpload;
