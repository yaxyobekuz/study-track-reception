// React
import { useEffect } from "react";

// Toast
import { toast } from "sonner";

// API
import { leadsAPI } from "@/features/leads/api/leads.api";

// Hooks
import useModal from "@/shared/hooks/useModal";
import useObjectState from "@/shared/hooks/useObjectState";

// Tanstack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Components
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import ResponsiveModal from "@/shared/components/ui/ResponsiveModal";

const LeadDirectionFormModal = () => {
  const { data } = useModal("leadDirectionForm");

  return (
    <ResponsiveModal
      name="leadDirectionForm"
      title={data?._id ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish qo'shish"}
    >
      <Content />
    </ResponsiveModal>
  );
};

const Content = ({
  _id,
  close,
  isLoading,
  setIsLoading,
  name: directionName,
  description: directionDescription,
}) => {
  const queryClient = useQueryClient();
  const isEdit = !!_id;

  const { state, setField, setFields } = useObjectState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isEdit) {
      setFields({
        name: directionName || "",
        description: directionDescription || "",
      });
    } else {
      setFields({ name: "", description: "" });
    }
  }, [_id]);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? leadsAPI.updateDirection(_id, data) : leadsAPI.createDirection(data),
    onSuccess: () => {
      toast.success(isEdit ? "Yo'nalish yangilandi" : "Yo'nalish yaratildi");
      queryClient.invalidateQueries({ queryKey: ["lead-directions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
      setIsLoading(false);
    },
    onSettled: () => setIsLoading(false),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!state.name.trim()) {
      toast.error("Yo'nalish nomi majburiy");
      return;
    }

    setIsLoading(true);
    mutation.mutate({
      name: state.name.trim(),
      description: state.description.trim(),
    });

    close();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        required
        label="Nomi"
        value={state.name}
        placeholder="Matematika, Ingliz tili, Dasturlash..."
        onChange={(e) => setField("name", e.target.value)}
      />
      <InputField
        label="Izoh"
        type="textarea"
        value={state.description}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="Qo'shimcha izoh..."
      />

      <div className="flex flex-col-reverse gap-3 xs:flex-row xs:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={close}
          className="w-full xs:w-32"
        >
          Bekor qilish
        </Button>
        <Button disabled={isLoading} className="w-full xs:w-32">
          {isLoading ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default LeadDirectionFormModal;
