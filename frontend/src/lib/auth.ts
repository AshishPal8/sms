import { jwtVerify } from "jose";

export async function verifyAuthToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { role: string };
  } catch (e) {
    console.error("Token verification failed:", e);
    return null;
  }
}
