// Toast
import { toast } from "sonner";

// API
import { leadsAPI } from "@/features/leads/api/leads.api";

// Tanstack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Components
import Button from "@/shared/components/ui/button/Button";
import ResponsiveModal from "@/shared/components/ui/ResponsiveModal";

const LeadSourceDeleteModal = () => (
  <ResponsiveModal
    name="leadSourceDelete"
    title="Manbani o'chirish"
    description="Haqiqatdan ham bu manbani o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi."
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading, _id, name }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => leadsAPI.deleteSource(_id),
    onSuccess: () => {
      toast.success("Manba o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["lead-sources"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
      setIsLoading(false);
    },
    onSettled: () => setIsLoading(false),
  });

  const handleDelete = (e) => {
    e.preventDefault();
    setIsLoading(true);
    deleteMutation.mutate();
    close();
  };

  return (
    <form
      onSubmit={handleDelete}
      className="flex flex-col-reverse gap-3 xs:flex-row xs:justify-end"
    >
      <Button
        type="button"
        variant="secondary"
        onClick={close}
        className="w-full xs:w-32"
      >
        Bekor qilish
      </Button>
      <Button
        autoFocus
        variant="danger"
        disabled={isLoading}
        className="w-full xs:w-32"
      >
        {isLoading ? "O'chirilmoqda..." : "O'chirish"}
      </Button>
    </form>
  );
};

export default LeadSourceDeleteModal;
