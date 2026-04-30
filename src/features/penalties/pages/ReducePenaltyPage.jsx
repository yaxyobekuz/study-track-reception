// Toast
import { toast } from "sonner";

// TanStack Query
import { useQuery, useMutation } from "@tanstack/react-query";

// API
import { penaltiesAPI } from "@/features/penalties/api/penalties.api";
import { usersAPI } from "@/features/users/api/users.api";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectSearch from "@/shared/components/ui/select/SelectSearch";

// Hooks
import useObjectState from "@/shared/hooks/useObjectState";

const ReducePenaltyPage = () => {
  const { state, setField, setFields } = useObjectState({
    userId: "",
    points: "",
    reason: "",
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["users", "all-users-short"],
    queryFn: () => usersAPI.getAllShort().then((res) => res.data.data),
  });

  const targetUsers = allUsers
    .filter((u) => u.role !== "owner")
    .map((u) => ({
      value: u._id,
      label: `${u.firstName}${u.lastName ? ` ${u.lastName}` : ""} (${u.role})`,
    }));

  const reduceMutation = useMutation({
    mutationFn: (data) => penaltiesAPI.reduce(data),
    onSuccess: () => {
      toast.success("Jarima kamaytirish so'rovi yuborildi. Owner tasdiqlashini kuting.");
      setFields({ userId: "", points: "", reason: "" });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Xatolik yuz berdi"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.userId || !state.points || !state.reason) {
      return toast.error("Barcha maydonlarni to'ldiring");
    }
    reduceMutation.mutate({
      userId: state.userId,
      points: Number(state.points),
      reason: state.reason,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Jarima kamaytirish
        </h2>
        <p className="text-sm text-gray-500">
          So'rov owner tomonidan tasdiqlanadi
        </p>
      </Card>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Foydalanuvchi <span className="text-red-500">*</span>
            </label>
            <SelectSearch
              required
              value={state.userId}
              options={targetUsers}
              placeholder="Foydalanuvchini tanlang..."
              searchPlaceholder="Ism bo'yicha qidirish..."
              emptyText="Foydalanuvchi topilmadi"
              onChange={(v) => setField("userId", v)}
              className="w-full"
            />
          </div>

          <InputField
            required
            min="1"
            type="number"
            label="Kamaytirilayotgan ball"
            value={state.points}
            onChange={(e) => setField("points", e.target.value)}
          />

          <InputField
            required
            label="Sabab"
            type="textarea"
            value={state.reason}
            onChange={(e) => setField("reason", e.target.value)}
          />

          <Button
            type="submit"
            disabled={reduceMutation.isPending || !state.userId}
          >
            {reduceMutation.isPending ? "Yuborilmoqda..." : "So'rov yuborish"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ReducePenaltyPage;
