// import sharp from "sharp";
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

console.log("Production ImageKit Config:", {
  publicKey: imagekitPublicKey
    ? `${imagekitPublicKey.substring(0, 10)}...`
    : "MISSING",
  privateKey: imagekitPrivateKey
    ? `${imagekitPrivateKey.substring(0, 10)}...`
    : "MISSING",
  urlEndpoint: imagekitUrlEndpoint || "MISSING",
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

    // if (type === AssetType.IMAGE) {
    //   try {
    //     fileBuffer = await sharp(file.buffer)
    //       .resize({ width: 1200, withoutEnlargement: true })
    //       .jpeg({ quality: 75 })
    //       .toBuffer();
    //   } catch (err) {
    //     console.error("Sharp optimization failed:", file.originalname, err);
    //     fileBuffer = file.buffer;
    //   }
    // }

    try {
      // prefer base64 upload for reliability
      const base64 = file.buffer.toString("base64");
      const resp = await imagekit.upload({
        file: base64,
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
      // log everything useful for debugging
      console.error("ImageKit upload failed:", fileName, {
        message: err?.message,
        name: err?.name,
        statusCode: err?.httpStatus || err?.statusCode,
        response: err?.response || err?.rawResponse || err?.errorResponse,
        stack: err?.stack,
      });

      // optional: a single retry for transient / network issues
      try {
        const base64 = file.buffer.toString("base64");
        const retryResp = await imagekit.upload({
          file: base64,
          fileName,
          folder: "/sms",
          useUniqueFileName: true,
        });

        uploadedFiles.push({
          url: retryResp.url,
          fileName: retryResp.name || fileName,
          type,
          provider: "imagekit",
          imagekitResponse: retryResp,
        });
        continue; // next file
      } catch (retryErr: any) {
        console.error("ImageKit retry failed:", fileName, retryErr);
        throw new Error(
          `ImageKit upload failed for ${fileName}: ${
            retryErr?.message || retryErr
          }`
        );
      }
    }
  }

  return uploadedFiles;
};
