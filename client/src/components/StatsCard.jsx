function StatsCard({
  title,
  value,
  icon: Icon,
  iconBg = "bg-purple-100",
  iconColor = "text-purple-600",
  onClick,
  active = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-white border rounded-xl p-4 shadow-sm transition-all ${
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
          : ""
      } ${
        active
          ? "border-purple-500 ring-2 ring-purple-100"
          : "border-gray-100"
      }`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3">

        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon
            className={iconColor}
            size={21}
          />
        </div>

        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {value}
          </p>

          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 truncate">
            {title}
          </p>
        </div>

      </div>
    </button>
  );
}



export default StatsCard;