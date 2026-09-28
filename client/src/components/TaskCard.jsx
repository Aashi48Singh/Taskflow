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
    <div
      className="
        w-full
        bg-white
        border
        border-purple-100
        rounded-xl
        sm:rounded-2xl
        p-4
        sm:p-5
        lg:p-6
        shadow-sm
        hover:shadow-md
        transition
      "
    >

      <div className="flex items-start gap-3 sm:gap-4">

        {/* CHECK BUTTON */}

        <button
          type="button"
          onClick={() => onComplete(task._id)}
          className="
            mt-0.5
            shrink-0
            flex
            items-center
            justify-center
            rounded-full
            focus:outline-none
            focus:ring-2
            focus:ring-purple-200
          "
          title={
            task.status === "completed"
              ? "Mark as pending"
              : "Mark as completed"
          }
        >
         
          {task.status === "completed" ? (
         
         <CheckCircle2
              className="text-green-500"
              size={22}
           
              />
          ) : (
           
            <Circle
              className="text-gray-300 hover:text-purple-500"
              size={22}
            />
         
         )}
        </button>

        {/* CONTENT */}

        <div className="flex-1 min-w-0">

          {/* TITLE + PRIORITY */}

          <div className="flex items-start gap-2 sm:gap-3 flex-wrap">

            <h3
              className={`
                min-w-0
                max-w-full
                text-sm
                sm:text-base
                lg:text-lg
                font-semibold
                leading-snug
                break-words
                ${
                  task.status === "completed"
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }
              `}
            >
              {task.title}
            </h3>

            <span
              className={`
                shrink-0
                px-2
                sm:px-2.5
                py-0.5
                rounded-full
                text-[10px]
                sm:text-xs
                font-medium
                capitalize
                ${
                  priorityClasses[task.priority] ||
                  priorityClasses.low
                }
              `}
            >
              {task.priority || "low"}
            </span>

          </div>

          {/* DESCRIPTION */}

          {task.description && (
            <p
              className="
                max-w-full
                text-xs
                sm:text-sm
                text-gray-500
                mt-1.5
                leading-relaxed
                break-words
              "
            >
              {task.description}
            </p>
          )}

          {/* DATE INFORMATION */}

          <div
            className="
              flex
              items-start
              gap-x-4
              gap-y-2
              mt-3
              text-xs
              sm:text-sm
              text-gray-400
              flex-wrap
            "
          >

            {task.dueDate && (
              <div className="flex items-center gap-1.5 min-w-0">

                <CalendarDays
                  size={14}
                  className="shrink-0 sm:w-[15px] sm:h-[15px]"
                />

                <span className="break-words">
                  Due{" "}
                  {new Date(
                    task.dueDate
                  ).toLocaleDateString()}
                </span>

              </div>
          
          )}

            {task.createdAt && (
              <div className="flex items-center gap-1.5 min-w-0">

                <Clock3
                  size={14}
                  className="shrink-0 sm:w-[15px] sm:h-[15px]"
                />

                <span className="break-words">
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
          type="button"
          onClick={() => onDelete(task._id)}
          className="
            shrink-0
            flex
            items-center
            justify-center
            w-8
            h-8
            rounded-lg
            text-gray-400
            hover:text-red-500
            hover:bg-red-50
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-red-100
          "
          title="Delete task"
        >
          <MoreVertical size={19} />
        </button>

      </div>

    </div>
  );
}

export default TaskCard;