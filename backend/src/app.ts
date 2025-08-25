import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { requestLogger } from "./middlewares/logger";
import { globalErrorHandler } from "./middlewares/error";

import uploadRoutes from "./modules/uploads/upload.route";

import authRoutes from "./modules/auth/auth.route";
import adminAuthRoutes from "./modules/admin/auth/auth.route";
import employeeRoutes from "./modules/admin/employees/employees.route";
import departmentRoutes from "./modules/admin/departments/department.route";
import ticketRoutes from "./modules/admin/tickets/ticket.route";
import notificationsRoutes from "./modules/notification/notification.route";
import customerRoutes from "./modules/user/user.routes";

export const app = express();

app.use(express.json());

// trust proxy for secure cookies in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api/upload", uploadRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminAuthRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/notifications", notificationsRoutes);

//user
app.use("/api/user", customerRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(globalErrorHandler);
