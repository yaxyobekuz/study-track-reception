// Tanstack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Toast
import { toast } from "sonner";

// API
import { leadsAPI } from "@/features/leads/api/leads.api";

// Hooks
import useObjectState from "@/shared/hooks/useObjectState";

// Data
import {
  leadStatusLabels,
  leadStatusColors,
  leadStatusOptionsForChange,
} from "@/features/leads/data/leads.data";

// Components
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import ResponsiveModal from "@/shared/components/ui/ResponsiveModal";

const LeadStatusContent = ({
  leadId,
  currentStatus,
  close,
  isLoading,
  setIsLoading,
}) => {
  const queryClient = useQueryClient();

  const { state, setField } = useObjectState({
    newStatus: currentStatus || "new",
    description: "",
    lostReason: "",
  });

  const needsReason = state.newStatus === "rejected" || state.newStatus === "lost";

  const mutation = useMutation({
    mutationFn: (data) => leadsAPI.updateStatus(leadId, data),
    onSuccess: () => {
      toast.success("Status muvaffaqiyatli yangilandi");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      close();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
    onSettled: () => setIsLoading(false),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.newStatus === currentStatus) {
      toast.error("Yangi status tanlang");
      return;
    }
    setIsLoading(true);
    mutation.mutate({
      status: state.newStatus,
      description: state.description.trim() || undefined,
      lostReason: needsReason ? state.lostReason.trim() || undefined : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current status */}
      <div>
        <p className="text-xs text-gray-400 mb-1">Hozirgi status</p>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${leadStatusColors[currentStatus]}`}
        >
          {leadStatusLabels[currentStatus]}
        </span>
      </div>

      {/* New status */}
      <SelectField
        required
        label="Yangi status"
        name="newStatus"
        value={state.newStatus}
        onChange={(v) => setField("newStatus", v)}
        options={leadStatusOptionsForChange.map((opt) => ({
          ...opt,
          label:
            opt.value === currentStatus
              ? `${opt.label} (hozirgi)`
              : opt.label,
          disabled: opt.value === currentStatus,
        }))}
      />

      {/* Description */}
      <InputField
        type="textarea"
        label="Izoh"
        name="description"
        value={state.description}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="Status o'zgartirish sababi..."
      />

      {/* Lost reason */}
      {needsReason && (
        <InputField
          type="textarea"
          label={state.newStatus === "rejected" ? "Rad etish sababi" : "Yo'qolish sababi"}
          name="lostReason"
          value={state.lostReason}
          onChange={(e) => setField("lostReason", e.target.value)}
          placeholder="Sababni yozing..."
        />
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saqlanmoqda..." : "Statusni o'zgartirish"}
      </Button>
    </form>
  );
};

const LeadStatusModal = () => {
  return (
    <ResponsiveModal name="leadStatus" title="Status o'zgartirish">
      <LeadStatusContent />
    </ResponsiveModal>
  );
};

export default LeadStatusModal;
