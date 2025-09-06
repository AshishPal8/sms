import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT;
export const jwtSecret = process.env.JWT_SECRET!;
export const backendUrl = process.env.BACKEND_URL!;
export const imagekitPublicKey = process.env.IMAGEKIT_PUBLIC_KEY!;
export const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
export const imagekitUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT!;
