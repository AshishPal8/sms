import type { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timeStamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  const userAgent = req.headers["user-agent"] || "unknown";
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  console.log(
    `[${timeStamp}] ${method} ${url} -IP: ${ip} -Device: ${userAgent}`
  );
  next();
};
