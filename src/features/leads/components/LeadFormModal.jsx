// React
import { useEffect } from "react";

// Tanstack Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Toast
import { toast } from "sonner";

// API
import { leadsAPI } from "@/features/leads/api/leads.api";

// Hooks
import useObjectState from "@/shared/hooks/useObjectState";

// Components
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import InputGroup from "@/shared/components/ui/input/InputGroup";
import SelectField from "@/shared/components/ui/select/SelectField";
import ResponsiveModal from "@/shared/components/ui/ResponsiveModal";

const LeadFormContent = ({ lead, close, isLoading, setIsLoading }) => {
  const queryClient = useQueryClient();

  const isEdit = !!lead;

  const { state: form, setField, setFields } = useObjectState({
    firstName: "",
    lastName: "",
    phone: "",
    additionalPhone: "",
    source: "",
    classInterest: "",
    parentName: "",
    parentPhone: "",
    address: "",
    notes: "",
    expectedEnrollDate: "",
  });

  // Load sources
  const { data: sourcesData } = useQuery({
    queryKey: ["lead-sources"],
    queryFn: () => leadsAPI.getSources().then((res) => res.data),
  });

  const sources = sourcesData?.data || [];

  // Populate form when editing
  useEffect(() => {
    if (lead) {
      setFields({
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        phone: lead.phone || "",
        additionalPhone: lead.additionalPhone || "",
        source: lead.source?._id || lead.source || "",
        classInterest: lead.classInterest || "",
        parentName: lead.parentName || "",
        parentPhone: lead.parentPhone || "",
        address: lead.address || "",
        notes: lead.notes || "",
        expectedEnrollDate: lead.expectedEnrollDate
          ? new Date(lead.expectedEnrollDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [lead]);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? leadsAPI.update(lead._id, data) : leadsAPI.create(data),
    onSuccess: () => {
      toast.success(
        isEdit
          ? "Sotuv muvaffaqiyatli yangilandi"
          : "Sotuv muvaffaqiyatli yaratildi",
      );
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
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.source) {
      toast.error("Ism, familiya, telefon va manba majburiy");
      return;
    }
    setIsLoading(true);

    const payload = { ...form };
    if (!payload.expectedEnrollDate) delete payload.expectedEnrollDate;
    if (!payload.additionalPhone) delete payload.additionalPhone;

    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <InputGroup className="grid-cols-2">
        <InputField
          required
          label="Ism"
          name="firstName"
          value={form.firstName}
          onChange={(e) => setField("firstName", e.target.value)}
          placeholder="Ism"
        />
        <InputField
          required
          label="Familiya"
          name="lastName"
          value={form.lastName}
          onChange={(e) => setField("lastName", e.target.value)}
          placeholder="Familiya"
        />
      </InputGroup>

      <InputGroup className="grid-cols-2">
        <InputField
          required
          type="tel"
          label="Telefon"
          name="phone"
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
          placeholder="+998..."
        />
        <InputField
          type="tel"
          label="Qo'shimcha telefon"
          name="additionalPhone"
          value={form.additionalPhone}
          onChange={(e) => setField("additionalPhone", e.target.value)}
          placeholder="+998..."
        />
      </InputGroup>

      <SelectField
        required
        searchable
        label="Manba"
        name="source"
        value={form.source}
        onChange={(v) => setField("source", v)}
        placeholder="Manbani tanlang..."
        options={sources.map((s) => ({ value: s._id, label: s.name }))}
      />

      <InputField
        label="Sinf / Yosh guruhi"
        name="classInterest"
        value={form.classInterest}
        onChange={(e) => setField("classInterest", e.target.value)}
        placeholder="Masalan: 5-sinf, 7-8 yosh"
      />

      <InputGroup className="grid-cols-2">
        <InputField
          label="Ota-ona ismi"
          name="parentName"
          value={form.parentName}
          onChange={(e) => setField("parentName", e.target.value)}
          placeholder="Ota-ona ismi"
        />
        <InputField
          type="tel"
          label="Ota-ona telefoni"
          name="parentPhone"
          value={form.parentPhone}
          onChange={(e) => setField("parentPhone", e.target.value)}
          placeholder="+998..."
        />
      </InputGroup>

      <InputField
        label="Manzil"
        name="address"
        value={form.address}
        onChange={(e) => setField("address", e.target.value)}
        placeholder="Manzil"
      />

      <InputField
        type="date"
        label="Kutilayotgan ro'yxat sanasi"
        name="expectedEnrollDate"
        value={form.expectedEnrollDate}
        onChange={(e) => setField("expectedEnrollDate", e.target.value)}
      />

      <InputField
        type="textarea"
        label="Izoh"
        name="notes"
        value={form.notes}
        onChange={(e) => setField("notes", e.target.value)}
        placeholder="Qo'shimcha izoh..."
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Saqlanmoqda..."
          : isEdit
            ? "Saqlash"
            : "Yaratish"}
      </Button>
    </form>
  );
};

const LeadFormModal = () => {
  return (
    <ResponsiveModal
      name="leadForm"
      title="Sotuv ma'lumotlari"
      className="max-w-lg"
    >
      <LeadFormContent />
    </ResponsiveModal>
  );
};

export default LeadFormModal;
