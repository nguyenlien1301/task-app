import mongoose from "mongoose";
export const connectData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Liên kết data thành công");
  } catch (error) {
    console.error("🚀error lỗi kết nối trên cổng 5001---->", error);
  }
};
