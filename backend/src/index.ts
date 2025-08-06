import { createServer } from "http";
import dotenv from "dotenv";
import { app } from "./app";
import { port } from "./utils/config";

dotenv.config();

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
