import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions, UploadApiResponse } from "cloudinary";

import streamifier from "streamifier";

import { getAssetTypeFromUrl } from "../../utils/getAssetType";
import { AssetType } from "../../generated/prisma";
import {
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} from "../../utils/config";

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

type UploadedFileResult = {
  url: string;
  fileName: string;
  type: AssetType;
  provider: "cloudinary";
  cloudinaryResponse?: any;
};

function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Empty Cloudinary response"));
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export const uploadFileService = async (
  files: Express.Multer.File[]
): Promise<UploadedFileResult[]> => {
  if (!files?.length) return [];

  const uploadedFiles: UploadedFileResult[] = [];

  for (const file of files) {
    const type = getAssetTypeFromUrl(file.originalname);

    const safeName = file.originalname.replace(/\s+/g, "_");
    const publicId = `${Date.now()}-${safeName.replace(/\.[^/.]+$/, "")}`;

    let fileBuffer = file.buffer;

    if (type === AssetType.IMAGE) {
      try {
        fileBuffer = await sharp(file.buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .jpeg({ quality: 75 })
          .toBuffer();
      } catch (err) {
        console.error("Sharp optimization failed:", file.originalname, err);
        fileBuffer = file.buffer;
      }
    }

    const uploadOptions: UploadApiOptions = {
      folder: "sms",
      public_id: publicId,
      use_filename: false,
      unique_filename: true,
      overwrite: false,
      resource_type: type === AssetType.IMAGE ? "image" : "raw",
      transformation: [{ width: 1200, crop: "limit" }],
    };

    try {
      const resp = await uploadBufferToCloudinary(fileBuffer, uploadOptions);

      uploadedFiles.push({
        url: resp.secure_url || resp.url,
        fileName: resp.public_id || publicId,
        type,
        provider: "cloudinary",
        cloudinaryResponse: resp,
      });
    } catch (err: any) {
      console.error(
        "Cloudinary upload failed:",
        publicId,
        err?.message || err,
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
      throw new Error(
        `Cloudinary upload failed for ${publicId}: ${err?.message || err}`
      );
    }
  }

  return uploadedFiles;
};
