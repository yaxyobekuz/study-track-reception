import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, CheckCheck } from "lucide-react";

import { studentAttendanceAPI } from "../api/studentAttendance.api";
import { STATUS_CYCLE, STATUS_LABELS } from "../data/studentAttendance.data";

import Button from "@/shared/components/ui/button/Button";
import StudentAttendanceList from "../components/StudentAttendanceList";
import ExcuseReasonModal from "../components/ExcuseReasonModal";
import { formatUzDate } from "@/shared/utils/formatDate";

const StudentAttendanceMarkPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // localStatuses: { [studentId]: status } — faqat o'zgartirilganlar
  const [localStatuses, setLocalStatuses] = useState({});
  // pendingIds: Set — o'zgartirilgan lekin saqlanmagan student idlar
  const [pendingIds, setPendingIds] = useState(new Set());
  // excuseModal: { studentId, nextStatus } | null
  const [excuseModal, setExcuseModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["studentAttendance", "today", classId],
    queryFn: () =>
      studentAttendanceAPI.getTodayClass(classId).then((r) => r.data),
  });

  const students = data?.students || [];
  const classInfo = data?.classInfo;

  // Aktiv "Kelmaslik sabablari" -> o'quvchiga tegishlilari
  const { data: reasonsData } = useQuery({
    queryKey: ["absenceReasons", "active"],
    queryFn: () =>
      studentAttendanceAPI.getAbsenceReasons().then((r) => r.data.data),
  });
  const studentReasons = (reasonsData || []).filter(
    (r) => r.appliesToAll || (r.roles || []).includes("student"),
  );

  // summary hisobi
  const summary = { present: 0, late: 0, absent: 0, excused: 0, unmarked: 0 };
  for (const { student, attendance } of students) {
    const id = String(student._id);
    const status = localStatuses[id] ?? (attendance?.status || null);
    if (!status) summary.unmarked++;
    else summary[status] = (summary[status] || 0) + 1;
  }

  const applyStatus = useCallback((studentId, status, excuse = undefined) => {
    setLocalStatuses((prev) => ({ ...prev, [studentId]: status }));
    setPendingIds((prev) => new Set([...prev, studentId]));

    if (excuse !== undefined) {
      // { absenceReasonId, note } ni alohida saqlab qo'yamiz
      setExcuseData((prev) => ({ ...prev, [studentId]: excuse }));
    }
  }, []);

  const [excuseData, setExcuseData] = useState({});

  const handleCycle = useCallback(
    (studentId, nextStatus) => {
      if (nextStatus === "excused") {
        setExcuseModal({ studentId, nextStatus });
        return;
      }
      applyStatus(studentId, nextStatus);
    },
    [applyStatus]
  );

  const handleExcuseConfirm = (payload) => {
    const { studentId } = excuseModal;
    applyStatus(studentId, "excused", payload);
    setExcuseModal(null);
  };

  const handleExcuseCancel = () => {
    const { studentId } = excuseModal;
    applyStatus(studentId, "present");
    setExcuseModal(null);
  };

  const handleMarkAll = () => {
    const newStatuses = {};
    const newPending = new Set(pendingIds);
    for (const { student, attendance } of students) {
      const id = String(student._id);
      // Faqat belgilanmagan yoki present bo'lmaganlarni o'zgartirish
      if (!attendance || attendance.status !== "present") {
        newStatuses[id] = "present";
        newPending.add(id);
      }
    }
    setLocalStatuses((prev) => ({ ...prev, ...newStatuses }));
    setPendingIds(newPending);
  };

  const handleSave = async () => {
    if (pendingIds.size === 0) return;

    const records = [];
    for (const studentId of pendingIds) {
      const status = localStatuses[studentId];
      if (!status) continue;
      const rec = { studentId, status };
      if (status === "excused") {
        const ex = excuseData[studentId] || {};
        rec.absenceReason = ex.absenceReasonId;
        rec.excuseReason = ex.note || undefined;
      }
      records.push(rec);
    }

    if (records.length === 0) return;

    // "Sababli" uchun sabab majburiy
    const missing = records.find(
      (r) => r.status === "excused" && !r.absenceReason,
    );
    if (missing) {
      toast.warning("'Sababli' o'quvchi uchun sabab tanlang");
      return;
    }

    setSaving(true);
    try {
      await studentAttendanceAPI.mark({
        classId,
        records,
      });

      // Pending tozalash
      setPendingIds(new Set());

      // Local state'ni saqlangan holatga moslashtirish (query'ni refresh qilish)
      await queryClient.invalidateQueries({
        queryKey: ["studentAttendance", "today", classId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["studentAttendance", "classes"],
      });

      // Local state'ni tozalash (yangi data query'dan keladi)
      setLocalStatuses({});
      setExcuseData({});

      toast.success(`${records.length} ta o'quvchi davomati saqlandi`);
    } catch {
      toast.error("Saqlashda xato yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-gray-500">Yuklanmoqda...</div>
    );
  }

  const today = new Date();

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/student-attendance")}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="page-title leading-tight">
              {classInfo?.name || "Sinf"}
            </h1>
            <p className="text-sm text-gray-500">{formatUzDate(today)}</p>
          </div>
        </div>

        {/* Summary + Mark all */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {Object.entries(summary).map(([key, count]) => {
              if (count === 0) return null;
              const label =
                key === "unmarked" ? "Belgilanmagan" : STATUS_LABELS[key];
              const colors = {
                present: "bg-green-100 text-green-700",
                late: "bg-yellow-100 text-yellow-700",
                absent: "bg-red-100 text-red-700",
                excused: "bg-blue-100 text-blue-700",
                unmarked: "bg-gray-100 text-gray-600",
              };
              return (
                <span
                  key={key}
                  className={`px-2 py-0.5 rounded-full font-medium ${colors[key]}`}
                >
                  {label}: {count}
                </span>
              );
            })}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 gap-1"
            onClick={handleMarkAll}
          >
            <CheckCheck size={15} />
            Hammasi keldi
          </Button>
        </div>
      </div>

      {/* Student list */}
      <div className="mt-3">
        <StudentAttendanceList
          students={students}
          statuses={localStatuses}
          pendingIds={pendingIds}
          onCycle={handleCycle}
        />
      </div>

      {/* Excuse reason inline modal */}
      {excuseModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-5 shadow-xl">
            <h2 className="font-semibold text-gray-900 mb-1">Sababli</h2>
            <ExcuseReasonModal
              reasons={studentReasons}
              onConfirm={handleExcuseConfirm}
              onCancel={handleExcuseCancel}
            />
          </div>
        </div>
      )}

      {/* Sticky save button */}
      {pendingIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-3 bg-white border-t border-gray-100 shadow-lg">
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saqlanmoqda..."
              : `Saqlash (${pendingIds.size} ta o'zgarish)`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceMarkPage;
