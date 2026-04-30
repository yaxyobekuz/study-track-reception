// Toast
import { toast } from "sonner";

// React
import { useState } from "react";

// TanStack Query
import { useQuery, useMutation } from "@tanstack/react-query";

// API
import { penaltiesAPI } from "@/features/penalties/api/penalties.api";
import { usersAPI } from "@/features/users/api/users.api";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import SelectSearch from "@/shared/components/ui/select/SelectSearch";

// Hooks
import useObjectState from "@/shared/hooks/useObjectState";

const CreatePenaltyPage = () => {
  const { state, setField, setFields } = useObjectState({
    userId: "",
    categoryId: "",
  });

  const [files, setFiles] = useState(null);

  const { data: allUsers = [] } = useQuery({
    queryKey: ["users", "all-users-short"],
    queryFn: () => usersAPI.getAllShort().then((res) => res.data.data),
  });

  // Owner'dan boshqa barcha rollar
  const targetUsers = allUsers
    .filter((u) => u.role !== "owner")
    .map((u) => ({
      value: u._id,
      label: `${u.firstName}${u.lastName ? ` ${u.lastName}` : ""} (${u.role})`,
    }));

  const { data: categories = [] } = useQuery({
    queryKey: ["penalties", "categories"],
    queryFn: () => penaltiesAPI.getCategories().then((res) => res.data.data),
    select: (data) =>
      data.map((c) => ({
        value: c._id,
        label: `${c.title} (${c.points} ball)`,
      })),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => penaltiesAPI.create(formData),
    onSuccess: () => {
      toast.success("Jarima yozildi va tasdiqlandi.");
      setFields({ userId: "", categoryId: "",  });
      setFiles(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Xatolik yuz berdi"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.userId || !state.categoryId) {
      return toast.error("Foydalanuvchi va kategoriya tanlang");
    }

    const formData = new FormData();
    formData.append("userId", state.userId);
    formData.append("categoryId", state.categoryId);
    if (files) {
      for (const file of files) {
        formData.append("files", file);
      }
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Jarima yozish</h2>
        <p className="text-sm text-gray-500">Jarima yozilganda darhol tasdiqlanadi</p>
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

          <SelectField
            required
            label="Kategoriya"
            value={state.categoryId}
            options={categories}
            placeholder="Kategoriyani tanlang..."
            onChange={(v) => setField("categoryId", v)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Fayllar (rasm/video/pdf)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm,application/pdf"
              onChange={(e) =>
                setFiles(e.target.files?.length ? e.target.files : null)
              }
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <Button
            type="submit"
            disabled={createMutation.isPending || !state.userId}
          >
            {createMutation.isPending ? "Yozilmoqda..." : "Jarima yozish"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreatePenaltyPage;
