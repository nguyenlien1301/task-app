// Controller là nơi tổ chức logic sửa lí chính khi có request gửi đến
import Task from "../models/Task.js";

export const getAllTasks = async (request, response) => {
  const { filter = "today" } = request.query;
  const now = new Date();
  let startDate;
  switch (filter) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "all":
    default: {
      startDate = null;
    }
  }
  const query = startDate ? { createdAt: { $gte: startDate } } : {};
  try {
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;
    response.status(200).json({
      tasks,
      activeCount,
      completeCount,
    });
  } catch (error) {
    console.log("🚀error Lỗi getAllTasks---->", error);
    response.status(500, { message: "Lỗi hệ thống" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log("🚀error Lỗi createTask---->", error);
    res.status(500).json("Lỗi hệ thông");
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completeAt } = req.body;
    const taskUpdate = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completeAt,
      },
      { new: true }
    );
    if (!taskUpdate) {
      return res.status(404).json("Nhiệm vụ không tồn tại");
    }
    res.status(200).json(taskUpdate);
  } catch (error) {
    console.log("🚀error Lỗi updateTask---->", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskDelete = await Task.findByIdAndDelete(req.params.id);
    if (!taskDelete) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(taskDelete);
  } catch (error) {
    console.log("🚀error Lỗi deleteTasks---->", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
