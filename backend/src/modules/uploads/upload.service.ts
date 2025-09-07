import sharp from "sharp";
import ImageKit from "imagekit";

import { getAssetTypeFromUrl } from "../../utils/getAssetType";
import { AssetType } from "../../generated/prisma";
import {
  imagekitPrivateKey,
  imagekitPublicKey,
  imagekitUrlEndpoint,
} from "../../utils/config";

const imagekit = new ImageKit({
  publicKey: imagekitPublicKey,
  privateKey: imagekitPrivateKey,
  urlEndpoint: imagekitUrlEndpoint,
});

type UploadedFileResult = {
  url: string;
  fileName: string;
  type: AssetType;
  provider: "imagekit";
  imagekitResponse?: any;
};

export const uploadFileService = async (
  files: Express.Multer.File[]
): Promise<UploadedFileResult[]> => {
  if (!files?.length) return [];

  const uploadedFiles: UploadedFileResult[] = [];

  for (const file of files) {
    const type = getAssetTypeFromUrl(file.originalname);
    const safeName = file.originalname.replace(/\s+/g, "_");
    const fileName = `${Date.now()}-${safeName}`;

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

    const mimeType = file.mimetype || "application/octet-stream";
    const base64 = fileBuffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64}`;

    try {
      const resp = await imagekit.upload({
        file: dataUri,
        fileName,
        folder: "/sms",
        useUniqueFileName: true,
      });

      uploadedFiles.push({
        url: resp.url,
        fileName: resp.name || fileName,
        type,
        provider: "imagekit",
        imagekitResponse: resp,
      });
    } catch (err: any) {
      console.error("ImageKit upload failed:", fileName, err?.message || err);
      throw new Error(
        `ImageKit upload failed for ${fileName}: ${err?.message}`
      );
    }
  }

  return uploadedFiles;
};
