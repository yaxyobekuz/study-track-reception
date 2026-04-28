// Toast
import { toast } from "sonner";

// React
import { useEffect } from "react";

// Router
import { useParams, useNavigate } from "react-router-dom";

// API
import { leadsAPI } from "@/features/leads/api/leads.api";

// Hooks
import useObjectState from "@/shared/hooks/useObjectState";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import BackHeader from "@/shared/components/layout/BackHeader";
import InputField from "@/shared/components/ui/input/InputField";
import InputGroup from "@/shared/components/ui/input/InputGroup";
import SelectField from "@/shared/components/ui/select/SelectField";

// Tanstack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const LeadFormPage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!leadId;

  const {
    state: form,
    setField,
    setFields,
  } = useObjectState({
    firstName: "",
    lastName: "",
    phone: "",
    additionalPhone: "",
    source: "",
    direction: "",
    category: "",
    classInterest: "",
    parentName: "",
    parentPhone: "",
    address: "",
    notes: "",
    expectedEnrollDate: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  // Fetch lead data for edit mode
  const { data: leadData } = useQuery({
    queryKey: ["leads", "detail", leadId],
    queryFn: () => leadsAPI.getById(leadId).then((res) => res.data),
    enabled: isEdit,
  });

  const lead = leadData?.data?.lead;

  // Populate form when editing
  useEffect(() => {
    if (lead) {
      setFields({
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        phone: lead.phone || "",
        additionalPhone: lead.additionalPhone || "",
        source: lead.source?._id || lead.source || "",
        direction: lead.direction?._id || lead.direction || "",
        category: lead.category?._id || lead.category || "",
        classInterest: lead.classInterest || "",
        parentName: lead.parentName || "",
        parentPhone: lead.parentPhone || "",
        address: lead.address || "",
        notes: lead.notes || "",
        expectedEnrollDate: lead.expectedEnrollDate
          ? new Date(lead.expectedEnrollDate).toISOString().split("T")[0]
          : "",
        createdAt: lead.createdAt
          ? new Date(lead.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [lead]);

  // Fetch sources
  const { data: sourcesData } = useQuery({
    queryKey: ["lead-sources"],
    queryFn: () => leadsAPI.getSources().then((res) => res.data),
  });

  // Fetch directions
  const { data: directionsData } = useQuery({
    queryKey: ["lead-directions"],
    queryFn: () => leadsAPI.getDirections().then((res) => res.data),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["lead-categories"],
    queryFn: () => leadsAPI.getCategories().then((res) => res.data),
  });

  const sources = sourcesData?.data || [];
  const directions = directionsData?.data || [];
  const categories = categoriesData?.data || [];

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? leadsAPI.update(leadId, data) : leadsAPI.create(data),
    onSuccess: () => {
      toast.success(
        isEdit
          ? "Sotuv muvaffaqiyatli yangilandi"
          : "Sotuv muvaffaqiyatli yaratildi",
      );
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      navigate(isEdit ? `/leads/${leadId}` : "/leads");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.source ||
      !form.direction ||
      !form.category
    ) {
      toast.error("Ism, familiya, telefon, manba, yo'nalish va toifa majburiy");
      return;
    }

    const payload = { ...form };
    if (!payload.expectedEnrollDate) delete payload.expectedEnrollDate;
    if (!payload.additionalPhone) delete payload.additionalPhone;
    if (!payload.createdAt) delete payload.createdAt;

    mutation.mutate(payload);
  };

  return (
    <div className="space-y-4">
      <BackHeader
        href={isEdit ? `/leads/${leadId}` : "/leads"}
        title={isEdit ? "Sotuvni tahrirlash" : "Yangi sotuv"}
      />

      <Card>
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

          <InputGroup className="grid-cols-2">
            <SelectField
              required
              searchable
              label="Yo'nalish"
              name="direction"
              value={form.direction}
              onChange={(v) => setField("direction", v)}
              placeholder="Yo'nalishni tanlang..."
              options={directions.map((d) => ({
                value: d._id,
                label: d.name,
              }))}
            />
            <SelectField
              required
              searchable
              label="Toifa"
              name="category"
              value={form.category}
              onChange={(v) => setField("category", v)}
              placeholder="Toifani tanlang..."
              options={categories.map((c) => ({
                value: c._id,
                label: c.name,
              }))}
            />
          </InputGroup>

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

          <InputGroup className="grid-cols-2">
            <InputField
              type="date"
              label="Sotuv sanasi"
              name="createdAt"
              value={form.createdAt}
              onChange={(e) => setField("createdAt", e.target.value)}
            />
            <InputField
              type="date"
              label="Kutilayotgan ro'yxat sanasi"
              name="expectedEnrollDate"
              value={form.expectedEnrollDate}
              onChange={(e) => setField("expectedEnrollDate", e.target.value)}
            />
          </InputGroup>

          <InputField
            type="textarea"
            label="Izoh"
            name="notes"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Qo'shimcha izoh..."
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saqlanmoqda..."
              : isEdit
                ? "Saqlash"
                : "Yaratish"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LeadFormPage;
