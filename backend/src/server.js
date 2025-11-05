import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectData } from "./config/db.js";
import tasksRouter from "./routes/tasksRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();
// app.use(express.json()): nhiệm vụ là kiểm tra data gửi lên có phải là json hay không, nếu có thì chuyển từ json qua obj, để xử lí cho tiện, nếu o có thì mỗi hàm phải .json để xư lí
// middleware
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/tasks", tasksRouter);
// Đảm bảo db được kết nối thì servẻ mới chạy cổng 5001
connectData().then(() => {
  app.listen(PORT, () => {
    console.log("Cổng 5001 đang chạy");
  });
});
