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
import LeadDirectionFormModal from "@/features/leads/components/LeadDirectionFormModal";
import LeadDirectionDeleteModal from "@/features/leads/components/LeadDirectionDeleteModal";

// Tanstack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const LeadDirectionsPage = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModal("leadDirectionForm");

  // Fetch directions
  const { data, isLoading } = useQuery({
    queryKey: ["lead-directions"],
    queryFn: () => leadsAPI.getDirections().then((res) => res.data),
  });

  const directions = data?.data || [];

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => leadsAPI.updateDirection(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-directions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-800">Sotuvlar yo'nalishlari</h1>
        <Button onClick={() => openModal("leadDirectionForm")} className="gap-1.5">
          <Plus size={16} />
          Yangi yo'nalish
        </Button>
      </div>

      {/* Directions list */}
      {isLoading ? (
        <Card className="text-center py-10 text-gray-400">Yuklanmoqda...</Card>
      ) : directions.length === 0 ? (
        <Card className="text-center py-10 text-gray-400">
          Yo'nalishlar topilmadi. Yangi yo'nalish qo'shing.
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
              {directions.map((direction) => (
                <tr
                  key={direction._id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    {direction.name}
                  </td>

                  <td className="py-2.5 px-3 text-gray-500">
                    {direction.description || "-"}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() =>
                        toggleActiveMutation.mutate({
                          id: direction._id,
                          isActive: !direction.isActive,
                        })
                      }
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer ${
                        direction.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {direction.isActive ? "Faol" : "Nofaol"}
                    </button>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal("leadDirectionForm", direction)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal("leadDirectionDelete", direction)}
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
      <LeadDirectionFormModal />
      <LeadDirectionDeleteModal />
    </div>
  );
};

export default LeadDirectionsPage;
