import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      strim: true,
    },
    status: {
      type: String,
      enum: ["active", "complete"],
      default: "active",
    },
    completeAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel;
