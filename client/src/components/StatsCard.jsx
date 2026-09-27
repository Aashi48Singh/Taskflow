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
      className={`w-full text-left bg-white border rounded-2xl p-5 shadow-sm transition-all ${
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
          : ""
      } ${
        active
          ? "border-purple-500 ring-2 ring-purple-100"
          : "border-gray-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon
            className={iconColor}
            size={25}
          />
        </div>

        <div>
          <p className="text-3xl font-bold text-gray-900">
            {value}
          </p>

          <p className="text-gray-500 text-sm">
            {title}
          </p>
        </div>
      </div>
    </button>
  );
}

export default StatsCard;