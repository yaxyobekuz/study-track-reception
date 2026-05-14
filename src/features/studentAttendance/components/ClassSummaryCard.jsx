import { useNavigate } from "react-router-dom";
import { ChevronRight, Users } from "lucide-react";

const ClassSummaryCard = ({ cls }) => {
  const navigate = useNavigate();

  const { _id, name, totalStudents = 0, markedToday = 0 } = cls;

  const unmarked = totalStudents - markedToday;

  return (
    <div
      className="bg-white rounded-2xl flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors"
      onClick={() => navigate(`/student-attendance/${_id}`)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Users size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">
            {markedToday}/{totalStudents} belgilandi
            {unmarked > 0 && (
              <span className="ml-1 text-orange-500 font-medium">
                · {unmarked} belgilanmagan
              </span>
            )}
          </p>
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
    </div>
  );
};

export default ClassSummaryCard;
