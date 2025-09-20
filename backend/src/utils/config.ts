import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT;
export const jwtSecret = process.env.JWT_SECRET!;
export const backendUrl = process.env.BACKEND_URL!;

export const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME!;
export const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY!;
export const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET!;

export const SETTINGS_KEY = "global";

export const DEFAULT_JWT_EXPIRY = "30d";
export const ADMIN_JWT_EXPIRY = "1d";
export const DEFAULT_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;
export const ADMIN_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24;
