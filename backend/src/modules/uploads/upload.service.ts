import ImageKit from "imagekit";
import sharp from "sharp";

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

import { getAssetTypeFromUrl } from "../../utils/getAssetType";
import { AssetType } from "../../generated/prisma";

export const uploadFileService = async (files: Express.Multer.File[]) => {
  const uploadedFiles = [];

  for (const file of files) {
    const type = getAssetTypeFromUrl(file.originalname);

    let fileBuffer = file.buffer;

    if (type === AssetType.IMAGE) {
      fileBuffer = await sharp(file.buffer)
        .resize({ width: 1200 })
        .jpeg({ quality: 75 })
        .toBuffer();
    }

    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "/sms",
    });

    uploadedFiles.push({
      url: uploadResponse.url,
      fileName: uploadResponse.name,
      type,
    });
  }

  return uploadedFiles;
};
