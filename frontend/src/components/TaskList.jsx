import TaskCard from "./TaskCard";
import TaskEmtyState from "./TaskEmtyState";

const TaskList = ({ filterTask, filter, handleTaskChanged }) => {
  if (!filterTask || filterTask.length === 0) {
    return <TaskEmtyState filter={filter} />;
  }
  return (
    <div className="space-y-3">
      {filterTask.map((task, index) => {
        return (
          <TaskCard
            key={task._id || index}
            task={task}
            index={index}
            handleTaskChanged={handleTaskChanged}
          />
        );
      })}
    </div>
  );
};

export default TaskList;
