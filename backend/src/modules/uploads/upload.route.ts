import { Router } from "express";
import multer from "multer";
import { uploadFilesController } from "./upload.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/assets", upload.array("files"), uploadFilesController);

export default router;
