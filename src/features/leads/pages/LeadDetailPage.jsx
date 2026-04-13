// React
import { useParams, useNavigate } from "react-router-dom";

// Tanstack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Icons
import {
  ArrowLeft,
  Phone,
  MapPin,
  User,
  Calendar,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";

// Toast
import { toast } from "sonner";

// API
import { leadsAPI } from "@/features/leads/api/leads.api";

// Data
import {
  leadStatusLabels,
  leadStatusColors,
  leadActivityTypeLabels,
  leadActivityTypeColors,
  leadActivityTypeOptions,
} from "@/features/leads/data/leads.data";

// Utils
import { formatDateUZ } from "@/shared/utils/date.utils";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import LeadFormModal from "@/features/leads/components/LeadFormModal";
import LeadStatusModal from "@/features/leads/components/LeadStatusModal";

// Hooks
import useModal from "@/shared/hooks/useModal";
import useObjectState from "@/shared/hooks/useObjectState";

const LeadDetailPage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openModal } = useModal("leadForm");
  const { openModal: openStatusModal } = useModal("leadStatus");

  // Activity form state
  const { state: activityForm, setField: setActivityField } = useObjectState({
    activityType: "note",
    activityDescription: "",
  });

  // Fetch lead detail
  const { data, isLoading } = useQuery({
    queryKey: ["leads", "detail", leadId],
    queryFn: () => leadsAPI.getById(leadId).then((res) => res.data),
  });

  const lead = data?.data?.lead;
  const activities = data?.data?.activities || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => leadsAPI.delete(leadId),
    onSuccess: () => {
      toast.success("Sotuv muvaffaqiyatli o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      navigate("/leads");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  // Create activity mutation
  const activityMutation = useMutation({
    mutationFn: (data) => leadsAPI.createActivity(leadId, data),
    onSuccess: () => {
      toast.success("Harakat muvaffaqiyatli qo'shildi");
      queryClient.invalidateQueries({ queryKey: ["leads", "detail", leadId] });
      setActivityField("activityDescription", "");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Haqiqatan ham bu sotuvni o'chirmoqchimisiz?")) {
      deleteMutation.mutate();
    }
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!activityForm.activityDescription.trim()) return;
    activityMutation.mutate({
      type: activityForm.activityType,
      description: activityForm.activityDescription.trim(),
    });
  };

  if (isLoading) {
    return (
      <Card className="text-center py-10 text-gray-400">Yuklanmoqda...</Card>
    );
  }

  if (!lead) {
    return (
      <Card className="text-center py-10 text-gray-400">Sotuv topilmadi</Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/leads")}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {lead.firstName} {lead.lastName}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium mt-1 ${leadStatusColors[lead.status]}`}
            >
              {leadStatusLabels[lead.status]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-1.5 text-sm"
            onClick={() =>
              openStatusModal("leadStatus", {
                leadId: lead._id,
                currentStatus: lead.status,
              })
            }
          >
            <RefreshCw size={14} />
            Status
          </Button>
          <Button
            variant="outline"
            className="gap-1.5 text-sm"
            onClick={() => openModal("leadForm", { lead })}
          >
            <Edit size={14} />
            Tahrirlash
          </Button>
          <Button
            variant="danger"
            className="gap-1.5 text-sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 size={14} />
            O'chirish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Lead info */}
        <div className="md:col-span-2 space-y-4">
          {/* Contact info */}
          <Card title="Aloqa ma'lumotlari">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Telefon</p>
                  <p className="text-sm text-gray-800">{lead.phone}</p>
                </div>
              </div>
              {lead.additionalPhone && (
                <div className="flex items-start gap-2.5">
                  <Phone size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Qo'shimcha telefon</p>
                    <p className="text-sm text-gray-800">
                      {lead.additionalPhone}
                    </p>
                  </div>
                </div>
              )}
              {lead.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Manzil</p>
                    <p className="text-sm text-gray-800">{lead.address}</p>
                  </div>
                </div>
              )}
              {lead.classInterest && (
                <div className="flex items-start gap-2.5">
                  <Calendar size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">
                      Qiziqish (sinf/yosh)
                    </p>
                    <p className="text-sm text-gray-800">
                      {lead.classInterest}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Parent info */}
          {(lead.parentName || lead.parentPhone) && (
            <Card title="Ota-ona ma'lumotlari">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                {lead.parentName && (
                  <div className="flex items-start gap-2.5">
                    <User size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Ota-ona ismi</p>
                      <p className="text-sm text-gray-800">{lead.parentName}</p>
                    </div>
                  </div>
                )}
                {lead.parentPhone && (
                  <div className="flex items-start gap-2.5">
                    <Phone size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Ota-ona telefoni</p>
                      <p className="text-sm text-gray-800">
                        {lead.parentPhone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Additional info */}
          <Card title="Qo'shimcha ma'lumotlar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-400">Manba</p>
                <p className="text-sm text-gray-800">
                  {lead.source?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Yaratilgan sana</p>
                <p className="text-sm text-gray-800">
                  {formatDateUZ(lead.createdAt)}
                </p>
              </div>
              {lead.expectedEnrollDate && (
                <div>
                  <p className="text-xs text-gray-400">
                    Kutilayotgan ro'yxat sanasi
                  </p>
                  <p className="text-sm text-gray-800">
                    {formatDateUZ(lead.expectedEnrollDate)}
                  </p>
                </div>
              )}
              {lead.createdBy && (
                <div>
                  <p className="text-xs text-gray-400">Yaratgan</p>
                  <p className="text-sm text-gray-800">
                    {lead.createdBy.firstName} {lead.createdBy.lastName}
                  </p>
                </div>
              )}
            </div>
            {lead.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Izoh</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {lead.notes}
                </p>
              </div>
            )}
            {lead.lostReason && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">
                  Rad etish / Yo'qolish sababi
                </p>
                <p className="text-sm text-red-600">{lead.lostReason}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Activities */}
        <div className="space-y-4">
          {/* Add activity form */}
          <Card title="Harakat qo'shish">
            <form onSubmit={handleAddActivity} className="mt-3 space-y-3">
              <SelectField
                label="Turi"
                name="activityType"
                value={activityForm.activityType}
                onChange={(v) => setActivityField("activityType", v)}
                options={leadActivityTypeOptions}
              />
              <InputField
                type="textarea"
                label="Izoh"
                name="activityDescription"
                value={activityForm.activityDescription}
                onChange={(e) =>
                  setActivityField("activityDescription", e.target.value)
                }
                placeholder="Izoh yozing..."
              />
              <Button
                type="submit"
                className="w-full"
                disabled={
                  !activityForm.activityDescription.trim() ||
                  activityMutation.isPending
                }
              >
                {activityMutation.isPending ? "Saqlanmoqda..." : "Qo'shish"}
              </Button>
            </form>
          </Card>

          {/* Activities timeline */}
          <Card title="Harakatlar tarixi">
            <div className="mt-3 space-y-3">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Hali harakatlar yo'q
                </p>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="relative pl-4 pb-3 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                  >
                    <div className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-gray-400" />
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${leadActivityTypeColors[activity.type]}`}
                      >
                        {leadActivityTypeLabels[activity.type]}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatDateUZ(activity.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {activity.description}
                    </p>
                    {activity.previousStatus && activity.newStatus && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {leadStatusLabels[activity.previousStatus]} →{" "}
                        {leadStatusLabels[activity.newStatus]}
                      </p>
                    )}
                    {activity.createdBy && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {activity.createdBy.firstName}{" "}
                        {activity.createdBy.lastName}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <LeadFormModal />
      <LeadStatusModal />
    </div>
  );
};

export default LeadDetailPage;
