import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import api from "../lib/axios";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

const AddTask = ({ handlNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const addTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        await api.post("/tasks", {
          title: newTaskTitle,
        });
        handlNewTaskAdded();
        toast.success(`Nhiệm vụ ${newTaskTitle} đã được thêm vào.`);
      } catch (error) {
        console.error("Lỗi khi thêm nhiệm vụ", error);
        toast.error("Lỗi khi thêm nhiệm vụ");
      }
      setNewTaskTitle("");
    } else {
      toast.error("Bạn cần nhập nội dung của nhiệm vụ");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };
  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          value={newTaskTitle}
          placeholder="Cần phải làm gì?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          onChange={(event) => setNewTaskTitle(event.target.value)}
          onKeyPress={handleKeyPress}
        />

        <Button
          variant="ghost"
          size="xl"
          className="px-4 cursor-pointer bg-blue-500 text-white"
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
        >
          <Plus className="size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
