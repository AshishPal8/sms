import fs from "fs";
import path from "path";
import sharp from "sharp";

import { getAssetTypeFromUrl } from "../../utils/getAssetType";
import { AssetType } from "../../generated/prisma";
import { backendUrl } from "../../utils/config";

const UPLOAD_DIR = path.join(__dirname, "../../../uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadFileService = async (files: Express.Multer.File[]) => {
  const uploadedFiles = [];

  for (const file of files) {
    const type = getAssetTypeFromUrl(file.originalname);

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    let fileBuffer = file.buffer;

    if (type === AssetType.IMAGE) {
      try {
        fileBuffer = await sharp(file.buffer)
          .resize({ width: 1200 })
          .jpeg({ quality: 75 })
          .toBuffer();
      } catch (err) {
        console.error("Image optimization failed, saving raw:", err);
      }
    }

    fs.writeFileSync(filePath, fileBuffer);

    const fileUrl = `${backendUrl}/uploads/${fileName}`;

    uploadedFiles.push({
      url: fileUrl,
      fileName,
      type,
    });
  }

  return uploadedFiles;
};
