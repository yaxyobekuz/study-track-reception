import { useState } from "react";
import Button from "@/shared/components/ui/button/Button";

const ExcuseReasonModal = ({ onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="space-y-4 pt-2">
      <p className="text-sm text-gray-600">
        Sababli deb belgilash uchun sabab yozishingiz mumkin (ixtiyoriy).
      </p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        maxLength={300}
        placeholder="Masalan: Kasal, Oilaviy sabab..."
        rows={3}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <p className="text-xs text-gray-400 text-right">{reason.length}/300</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Bekor qilish
        </Button>
        <Button
          className="flex-1"
          onClick={() => onConfirm(reason.trim() || null)}
        >
          Sababli qilish
        </Button>
      </div>
    </div>
  );
};

export default ExcuseReasonModal;
