import { useQuery } from "@tanstack/react-query";
import { studentAttendanceAPI } from "../api/studentAttendance.api";
import ClassSummaryCard from "../components/ClassSummaryCard";

const StudentAttendancePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["studentAttendance", "classes"],
    queryFn: () => studentAttendanceAPI.getClasses().then((r) => r.data.data),
    refetchInterval: 60000,
  });

  return (
    <div className="space-y-4">
      <h1 className="page-title">O'quvchilar davomati</h1>

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Yuklanmoqda...</div>
      ) : !data || data.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          Faol sinflar topilmadi
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((cls) => (
            <ClassSummaryCard key={cls._id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAttendancePage;
