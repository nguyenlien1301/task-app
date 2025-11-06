import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { connectData } from "./config/db.js";
import tasksRouter from "./routes/tasksRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();
// app.use(express.json()): nhiệm vụ là kiểm tra data gửi lên có phải là json hay không, nếu có thì chuyển từ json qua obj, để xử lí cho tiện, nếu o có thì mỗi hàm phải .json để xư lí
// middleware
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use("/api/tasks", tasksRouter);

if (process.env.NODE_ENV === "production") {
  // path.join: là để nối đường dẫn đến thư mục hiện tại
  // express.static: Yêu cầu express lấy toàn bộ file tĩnh ở trong thư mục dist html css js và gửi cho ng dùng khi học truy cập
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  // Logic để khi ng dùng truy cập bát kì đường dẫn nào mà backend ko định nghĩa trước thì mình sẽ trả về trangn index.html bên front end
  // req.sendFile: Gửi về 1 trang cụ thể
  // "../frontend/dist/index.html": cụm này nghĩa là với bất kì url nào mà ng dùng rõ vào trình duyệt back end luôn trả về trang index.html để react route ở frontend lo phần điều hướng tiếp theo.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Đảm bảo db được kết nối thì servẻ mới chạy cổng 5001
connectData().then(() => {
  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});
