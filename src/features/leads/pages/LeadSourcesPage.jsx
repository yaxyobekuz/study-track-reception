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
import LeadSourceFormModal from "@/features/leads/components/LeadSourceFormModal";
import LeadSourceDeleteModal from "@/features/leads/components/LeadSourceDeleteModal";

// Tanstack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const LeadSourcesPage = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModal("leadSourceForm");

  // Fetch sources
  const { data, isLoading } = useQuery({
    queryKey: ["lead-sources"],
    queryFn: () => leadsAPI.getSources().then((res) => res.data),
  });

  const sources = data?.data || [];

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => leadsAPI.updateSource(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-sources"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-800">Sotuv manbalari</h1>
        <Button onClick={() => openModal("leadSourceForm")} className="gap-1.5">
          <Plus size={16} />
          Yangi manba
        </Button>
      </div>

      {/* Sources list */}
      {isLoading ? (
        <Card className="text-center py-10 text-gray-400">Yuklanmoqda...</Card>
      ) : sources.length === 0 ? (
        <Card className="text-center py-10 text-gray-400">
          Manbalar topilmadi. Yangi manba qo'shing.
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
              {sources.map((source) => (
                <tr
                  key={source._id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    {source.name}
                  </td>

                  <td className="py-2.5 px-3 text-gray-500">
                    {source.description || "-"}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() =>
                        toggleActiveMutation.mutate({
                          id: source._id,
                          isActive: !source.isActive,
                        })
                      }
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer ${
                        source.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {source.isActive ? "Faol" : "Nofaol"}
                    </button>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal("leadSourceForm", source)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal("leadSourceDelete", source)}
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
      <LeadSourceFormModal />
      <LeadSourceDeleteModal />
    </div>
  );
};

export default LeadSourcesPage;
