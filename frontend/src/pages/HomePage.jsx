import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddTask from "../components/AddTask";
import DateTimeFilter from "../components/DateTimeFilter";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TaskAndFilter from "../components/TaskAndFilter";
import TaskList from "../components/TaskList";
import TaskListPagination from "../components/TaskListPagination";
import api from "../lib/axios";
import { visibleTaskLimit } from "../lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);
  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompletedTaskCount(res.data.completeCount);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất task", error);
      toast.error("Lỗi xảy ra khi truy xuất task");
    }
  };
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "complete":
        return task.status === "complete";
      default:
        return true;
    }
  });
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );
  if (visibleTasks.length === 0) {
    handlePrev();
  }
  const handleAddChanged = () => {
    fetchTasks();
  };
  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35) 0%, transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4) 0%, transparent 60%)
      `,
        }}
      />
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl -6 mx-auto space-y-6">
          {/* Đầu trang */}
          <Header />
          {/* Tạo nhiệm vụ */}
          <AddTask handlNewTaskAdded={handleAddChanged} />
          {/* Thống kê và bộ lọc */}
          <TaskAndFilter
            filter={filter}
            setFilter={setFilter}
            completeTasksCount={completedTaskCount}
            activeTasksCount={activeTaskCount}
          />
          {/* Danhg sách nhiệm vụ */}
          <TaskList
            filterTask={visibleTasks}
            filter={filter}
            handleTaskChanged={handleAddChanged}
          />
          {/* Phân trang và lọc theo ngày */}
          <div className="flex items-center justify-between gap-6 sx:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
          {/* Chân trang */}
          <Footer
            completeTasksCount={completedTaskCount}
            activeTasksCount={activeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
