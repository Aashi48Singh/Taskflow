import {
  Circle,
  CheckCircle2,
  MoreVertical,
  CalendarDays,
  Clock3,
} from "lucide-react";

function TaskCard({
  task,
  onComplete,
  onDelete,
}) {
  const priorityClasses = {
    low: "bg-green-100 text-green-600",
    medium: "bg-orange-100 text-orange-600",
    high: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

      <div className="flex items-start gap-4">

        {/* CHECK BUTTON */}

        <button
          onClick={() =>
            onComplete(task._id)
          }
          className="mt-1"
          title={
            task.status === "completed"
              ? "Mark as pending"
              : "Mark as completed"
          }
        >

          {task.status === "completed" ? (

            <CheckCircle2
              className="text-green-500"
              size={25}
            />

          ) : (

            <Circle
              className="text-gray-300 hover:text-purple-500"
              size={25}
            />

          )}

        </button>

        {/* CONTENT */}

        <div className="flex-1">

          <div className="flex items-center gap-3 flex-wrap">

            <h3
              className={`text-xl font-semibold ${
                task.status === "completed"
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              }`}
            >
              {task.title}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                priorityClasses[
                  task.priority
                ] ||
                priorityClasses.low
              }`}
            >
              {task.priority || "low"}
            </span>

          </div>

          {task.description && (
            <p className="text-gray-500 mt-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-5 mt-5 text-sm text-gray-400 flex-wrap">

            {task.dueDate && (

              <div className="flex items-center gap-2">

                <CalendarDays size={16} />

                <span>
                  Due{" "}
                  {new Date(
                    task.dueDate
                  ).toLocaleDateString()}
                </span>

              </div>

            )}

            {task.createdAt && (

              <div className="flex items-center gap-2">

                <Clock3 size={16} />

                <span>
                  Created{" "}
                  {new Date(
                    task.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>

            )}

          </div>

        </div>

        {/* DELETE */}

        <button
          onClick={() =>
            onDelete(task._id)
          }
          className="text-gray-400 hover:text-red-500 transition"
          title="Delete task"
        >
          <MoreVertical size={22} />
        </button>

      </div>

    </div>
  );
}

export default TaskCard;