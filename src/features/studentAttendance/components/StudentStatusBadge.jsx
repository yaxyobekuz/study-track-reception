import { cn } from "@/shared/utils/cn";
import { STATUS_LABELS, STATUS_COLORS, STATUS_ICON, STATUS_CYCLE } from "../data/studentAttendance.data";

const StudentStatusBadge = ({ studentId, status, pending, onCycle }) => {
  const handleClick = () => {
    if (!status) {
      onCycle(studentId, STATUS_CYCLE[0]);
      return;
    }
    const currentIndex = STATUS_CYCLE.indexOf(status);
    const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
    onCycle(studentId, STATUS_CYCLE[nextIndex]);
  };

  if (!status) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium border transition-all min-w-[100px] text-center",
          "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200"
        )}
      >
        Belgilang
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all min-w-[100px] text-center",
        STATUS_COLORS[status],
        pending && "ring-2 ring-offset-1 ring-primary/40"
      )}
    >
      <span className="mr-1">{STATUS_ICON[status]}</span>
      {STATUS_LABELS[status]}
    </button>
  );
};

export default StudentStatusBadge;
