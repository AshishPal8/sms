import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../middlewares/error";
import { uploadFileService } from "./upload.service";

export const uploadFilesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
      throw new BadRequestError("No files uploaded");
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = await uploadFileService(files);

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};
