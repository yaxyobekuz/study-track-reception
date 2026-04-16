// Toast
import { toast } from "sonner";

// API
import { leadsAPI } from "@/features/leads/api/leads.api";

// Hooks
import useModal from "@/shared/hooks/useModal";

// Icons
import { Plus, Edit, Trash2 } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import LeadCategoryFormModal from "@/features/leads/components/LeadCategoryFormModal";
import LeadCategoryDeleteModal from "@/features/leads/components/LeadCategoryDeleteModal";

// Tanstack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const LeadCategoriesPage = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModal("leadCategoryForm");

  // Fetch categories
  const { data, isLoading } = useQuery({
    queryKey: ["lead-categories"],
    queryFn: () => leadsAPI.getCategories().then((res) => res.data),
  });

  const categories = data?.data || [];

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => leadsAPI.updateCategory(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-categories"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-800">Sotuvlar toifalari</h1>
        <Button onClick={() => openModal("leadCategoryForm")} className="gap-1.5">
          <Plus size={16} />
          Yangi toifa
        </Button>
      </div>

      {/* Categories list */}
      {isLoading ? (
        <Card className="text-center py-10 text-gray-400">Yuklanmoqda...</Card>
      ) : categories.length === 0 ? (
        <Card className="text-center py-10 text-gray-400">
          Toifalar topilmadi. Yangi toifa qo'shing.
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2.5 px-3">Nomi</th>
                <th className="text-left py-2.5 px-3">Izoh</th>
                <th className="text-center py-2.5 px-3">Holati</th>
                <th className="text-center py-2.5 px-3">Harakatlar</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    {category.name}
                  </td>

                  <td className="py-2.5 px-3 text-gray-500">
                    {category.description || "-"}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() =>
                        toggleActiveMutation.mutate({
                          id: category._id,
                          isActive: !category.isActive,
                        })
                      }
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {category.isActive ? "Faol" : "Nofaol"}
                    </button>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal("leadCategoryForm", category)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal("leadCategoryDelete", category)}
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <LeadCategoryFormModal />
      <LeadCategoryDeleteModal />
    </div>
  );
};

export default LeadCategoriesPage;
