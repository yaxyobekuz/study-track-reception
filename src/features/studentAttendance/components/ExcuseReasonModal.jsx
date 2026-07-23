import { useState } from "react";
import { toast } from "sonner";

import Button from "@/shared/components/ui/button/Button";
import SelectField from "@/shared/components/ui/select/SelectField";

const ExcuseReasonModal = ({ reasons = [], onConfirm, onCancel }) => {
  const [absenceReasonId, setAbsenceReasonId] = useState("");
  const [note, setNote] = useState("");

  const options = reasons.map((r) => ({ label: r.title, value: r.id }));
  const noReasons = options.length === 0;

  const handleConfirm = () => {
    if (!absenceReasonId) return toast.warning("Sababni tanlang");
    onConfirm({ absenceReasonId, note: note.trim() || null });
  };

  return (
    <div className="space-y-4 pt-2">
      {noReasons ? (
        <p className="text-sm text-red-500">
          O&apos;quvchilar uchun sabablar mavjud emas. Administrator bilan
          bog&apos;laning.
        </p>
      ) : (
        <SelectField
          required
          label="Sabab"
          value={absenceReasonId}
          options={options}
          placeholder="Sababni tanlang"
          onChange={(v) => setAbsenceReasonId(v)}
        />
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={300}
        placeholder="Qo'shimcha izoh (ixtiyoriy)"
        rows={3}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <p className="text-xs text-gray-400 text-right">{note.length}/300</p>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Bekor qilish
        </Button>
        <Button
          className="flex-1"
          disabled={noReasons}
          onClick={handleConfirm}
        >
          Sababli qilish
        </Button>
      </div>
    </div>
  );
};

export default ExcuseReasonModal;
