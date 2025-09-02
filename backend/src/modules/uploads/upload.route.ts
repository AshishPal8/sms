import { Router } from "express";
import multer from "multer";
import { uploadFilesController } from "./upload.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/assets", upload.array("files", 10), uploadFilesController);

export default router;
