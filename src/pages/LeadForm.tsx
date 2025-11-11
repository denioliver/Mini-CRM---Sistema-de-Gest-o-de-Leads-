import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLeads } from "../contexts/LeadsContext";
import { useAuth } from "../contexts/AuthContext";
import { LeadStatus, LeadSource } from "../types";
import { ArrowLeft, Save } from "lucide-react";
import "./LeadForm.css";

const LeadForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLead, addLead, updateLead } = useLeads();
  const { user } = useAuth();
  const isEditing = !!id;

  const existingLead = isEditing ? getLead(id!) : null;

  const [formData, setFormData] = useState({
    name: existingLead?.name || "",
    email: existingLead?.email || "",
    phone: existingLead?.phone || "",
    company: existingLead?.company || "",
    position: existingLead?.position || "",
    status: existingLead?.status || ("novo" as LeadStatus),
    source: existingLead?.source || ("website" as LeadSource),
    value: existingLead?.value?.toString() || "",
    observations: existingLead?.observations || "",
    tags: existingLead?.tags?.join(", ") || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && !existingLead) {
      alert("Lead não encontrado!");
      navigate("/leads");
    }
  }, [isEditing, existingLead, navigate]);

  const statuses: { value: LeadStatus; label: string }[] = [
    { value: "novo", label: "Novo" },
    { value: "contato", label: "Contato" },
    { value: "qualificado", label: "Qualificado" },
    { value: "proposta", label: "Proposta" },
    { value: "negociacao", label: "Negociação" },
    { value: "ganho", label: "Ganho" },
    { value: "perdido", label: "Perdido" },
  ];

  const sources: { value: LeadSource; label: string }[] = [
    { value: "website", label: "Website" },
    { value: "indicacao", label: "Indicação" },
    { value: "telefone", label: "Telefone" },
    { value: "email", label: "Email" },
    { value: "evento", label: "Evento" },
    { value: "midia-social", label: "Mídia Social" },
    { value: "outro", label: "Outro" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !user) return;

    setIsSubmitting(true);

    try {
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || undefined,
        position: formData.position.trim() || undefined,
        status: formData.status,
        source: formData.source,
        value: formData.value ? parseFloat(formData.value) : undefined,
        observations: formData.observations.trim() || undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };

      if (isEditing) {
        await updateLead(id!, leadData);
        alert("Lead atualizado com sucesso!");
        navigate(`/leads/${id}`);
      } else {
        await addLead({
          ...leadData,
          createdBy: user.id,
        });
        alert("Lead criado com sucesso!");
        navigate("/leads");
      }
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      alert("Erro ao salvar lead. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lead-form-page">
      <div className="lead-form-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <h1>{isEditing ? "Editar Lead" : "Novo Lead"}</h1>
      </div>

      <div className="lead-form-container">
        <form onSubmit={handleSubmit} className="lead-form">
          {/* Informações Básicas */}
          <div className="form-section">
            <h2>Informações Básicas</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">
                  Nome <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                  placeholder="Nome completo do lead"
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Telefone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="company">Empresa</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Nome da empresa"
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Cargo</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Cargo do lead"
                />
              </div>
            </div>
          </div>

          {/* Status e Origem */}
          <div className="form-section">
            <h2>Classificação</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="source">Origem</label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                >
                  {sources.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="value">Valor (R$)</label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Observações e Tags */}
          <div className="form-section">
            <h2>Informações Adicionais</h2>
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Separe as tags por vírgula (ex: vip, urgente)"
              />
              <small>Separe múltiplas tags com vírgula</small>
            </div>

            <div className="form-group">
              <label htmlFor="observations">Observações</label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                placeholder="Informações adicionais sobre o lead..."
                rows={4}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Save size={18} />
              <span>
                {isSubmitting
                  ? "Salvando..."
                  : isEditing
                  ? "Salvar Alterações"
                  : "Criar Lead"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
