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

const LeadCategoryFormModal = () => {
  const { data } = useModal("leadCategoryForm");

  return (
    <ResponsiveModal
      name="leadCategoryForm"
      title={data?._id ? "Toifani tahrirlash" : "Yangi toifa qo'shish"}
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
  name: categoryName,
  description: categoryDescription,
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
        name: categoryName || "",
        description: categoryDescription || "",
      });
    } else {
      setFields({ name: "", description: "" });
    }
  }, [_id]);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? leadsAPI.updateCategory(_id, data) : leadsAPI.createCategory(data),
    onSuccess: () => {
      toast.success(isEdit ? "Toifa yangilandi" : "Toifa yaratildi");
      queryClient.invalidateQueries({ queryKey: ["lead-categories"] });
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
      toast.error("Toifa nomi majburiy");
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
        placeholder="Individual, Guruh, Online..."
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

export default LeadCategoryFormModal;
