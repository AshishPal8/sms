import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { requestLogger } from "./middlewares/logger";
import { globalErrorHandler } from "./middlewares/error";

import uploadRoutes from "./modules/uploads/upload.route";
import authRoutes from "./modules/admin/auth/auth.route";
import employeeRoutes from "./modules/admin/employees/employees.route";
import departmentRoutes from "./modules/admin/departments/department.route";
import customerRoutes from "./modules/user/user.routes";

export const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api/upload", uploadRoutes);

app.use("/api/admin", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);

//user
app.use("/api/user", customerRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(globalErrorHandler);
