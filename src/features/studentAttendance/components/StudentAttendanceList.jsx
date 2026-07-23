import StudentStatusBadge from "./StudentStatusBadge";

const StudentAttendanceList = ({ students, statuses, pendingIds, onCycle }) => {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        Bu sinfda o'quvchilar yo'q
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {students.map(({ student, attendance }) => {
        const studentId = String(student.id);
        const currentStatus =
          statuses[studentId] ?? (attendance?.status || null);
        const isPending = pendingIds.has(studentId);

        return (
          <div
            key={studentId}
            className="flex items-center justify-between py-3 px-1"
          >
            <div className="flex items-center gap-3 min-w-0 text-sm font-medium text-gray-800 truncate">
              {student.lastName} {student.firstName}
            </div>
            <div className="flex-shrink-0 ml-2">
              <StudentStatusBadge
                studentId={studentId}
                status={currentStatus}
                pending={isPending}
                onCycle={onCycle}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentAttendanceList;
