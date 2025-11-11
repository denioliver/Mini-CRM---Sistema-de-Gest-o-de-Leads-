import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLeads } from "../contexts/LeadsContext";
import { useAuth } from "../contexts/AuthContext";
import { LeadStatus } from "../types";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  Tag,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  getStatusLabel,
  getSourceLabel,
  getStatusColor,
} from "../utils/formatters";
import "./LeadDetails.css";

const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLead, addInteraction, updateLead, deleteLead } = useLeads();
  const { user } = useAuth();

  const [lead, setLead] = useState(getLead(id!));
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [interactionType, setInteractionType] = useState<string>("nota");
  const [interactionDescription, setInteractionDescription] = useState("");

  useEffect(() => {
    setLead(getLead(id!));
  }, [id, getLead]);

  if (!lead) {
    return (
      <div className="lead-details-container">
        <div className="error-state">
          <h2>Lead não encontrado</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!interactionDescription.trim() || !user) return;

    try {
      await addInteraction(lead.id, {
        type: interactionType as
          | "email"
          | "telefone"
          | "reuniao"
          | "nota"
          | "whatsapp"
          | "outro",
        description: interactionDescription,
        date: new Date(),
        userId: user.id,
        userName: user.name,
      });

      setInteractionDescription("");
      setShowInteractionForm(false);

      // Atualizar lead com os dados mais recentes
      const updatedLead = getLead(id!);
      if (updatedLead) setLead(updatedLead);
    } catch (error) {
      console.error("Erro ao adicionar interação:", error);
      alert("Erro ao adicionar interação. Tente novamente.");
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    try {
      await updateLead(lead.id, { status: newStatus });

      // Atualizar lead com os dados mais recentes
      const updatedLead = getLead(id!);
      if (updatedLead) setLead(updatedLead);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const handleEdit = () => {
    navigate(`/leads/${id}/edit`);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`)
    ) {
      return;
    }

    try {
      await deleteLead(lead.id);
      alert("Lead excluído com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao excluir lead:", error);
      alert("Erro ao excluir lead. Tente novamente.");
    }
  };

  return (
    <div className="lead-details-container">
      {/* Header */}
      <div className="lead-details-header">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleEdit}>
            <Edit2 size={18} />
            <span>Editar</span>
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={18} />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      <div className="lead-details-content">
        {/* Coluna Principal */}
        <div className="lead-main-column">
          {/* Card de Informações */}
          <div className="card lead-info-card">
            <div className="lead-info-header">
              <div>
                <h1>{lead.name}</h1>
                <div className="lead-meta">
                  <span className="meta-item">
                    <Calendar size={14} />
                    Criado em {formatDateTime(lead.createdAt)}
                  </span>
                </div>
              </div>
              <div
                className="status-badge"
                style={{ backgroundColor: getStatusColor(lead.status) }}
              >
                {getStatusLabel(lead.status)}
              </div>
            </div>

            <div className="lead-info-grid">
              <div className="info-item">
                <Mail size={18} />
                <div>
                  <span className="info-label">E-mail</span>
                  <a href={`mailto:${lead.email}`} className="info-value">
                    {lead.email}
                  </a>
                </div>
              </div>

              <div className="info-item">
                <Phone size={18} />
                <div>
                  <span className="info-label">Telefone</span>
                  <a href={`tel:${lead.phone}`} className="info-value">
                    {lead.phone}
                  </a>
                </div>
              </div>

              {lead.company && (
                <div className="info-item">
                  <Building2 size={18} />
                  <div>
                    <span className="info-label">Empresa</span>
                    <span className="info-value">{lead.company}</span>
                  </div>
                </div>
              )}

              {lead.position && (
                <div className="info-item">
                  <Briefcase size={18} />
                  <div>
                    <span className="info-label">Cargo</span>
                    <span className="info-value">{lead.position}</span>
                  </div>
                </div>
              )}

              {lead.value && (
                <div className="info-item">
                  <DollarSign size={18} />
                  <div>
                    <span className="info-label">Valor</span>
                    <span className="info-value">
                      {formatCurrency(lead.value)}
                    </span>
                  </div>
                </div>
              )}

              <div className="info-item">
                <Tag size={18} />
                <div>
                  <span className="info-label">Origem</span>
                  <span className="info-value">
                    {getSourceLabel(lead.source)}
                  </span>
                </div>
              </div>
            </div>

            {lead.tags && lead.tags.length > 0 && (
              <div className="lead-tags-section">
                <span className="info-label">Tags:</span>
                <div className="lead-tags">
                  {lead.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lead.observations && (
              <div className="lead-observations">
                <span className="info-label">Observações:</span>
                <p>{lead.observations}</p>
              </div>
            )}
          </div>

          {/* Histórico de Interações */}
          <div className="card interactions-card">
            <div className="interactions-header">
              <h2>
                <MessageSquare size={20} />
                Histórico de Interações
              </h2>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowInteractionForm(!showInteractionForm)}
              >
                <Plus size={18} />
                Nova Interação
              </button>
            </div>

            {showInteractionForm && (
              <form
                onSubmit={handleAddInteraction}
                className="interaction-form"
              >
                <div className="form-group">
                  <label htmlFor="type">Tipo de Interação</label>
                  <select
                    id="type"
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value)}
                    required
                  >
                    <option value="nota">Nota</option>
                    <option value="email">E-mail</option>
                    <option value="telefone">Telefone</option>
                    <option value="reuniao">Reunião</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    value={interactionDescription}
                    onChange={(e) => setInteractionDescription(e.target.value)}
                    placeholder="Descreva a interação..."
                    required
                    rows={4}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowInteractionForm(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Adicionar Interação
                  </button>
                </div>
              </form>
            )}

            <div className="interactions-timeline">
              {lead.interactions.length === 0 ? (
                <div className="empty-state">
                  <MessageSquare size={48} />
                  <p>Nenhuma interação registrada ainda</p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowInteractionForm(true)}
                  >
                    Adicionar primeira interação
                  </button>
                </div>
              ) : (
                lead.interactions
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((interaction) => (
                    <div key={interaction.id} className="interaction-item">
                      <div className="interaction-icon">
                        <MessageSquare size={16} />
                      </div>
                      <div className="interaction-content">
                        <div className="interaction-header">
                          <span className="interaction-type">
                            {interaction.type}
                          </span>
                          <span className="interaction-date">
                            {formatDateTime(interaction.date)}
                          </span>
                        </div>
                        <p className="interaction-description">
                          {interaction.description}
                        </p>
                        <span className="interaction-user">
                          Por: {interaction.userName}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lead-sidebar">
          {/* Card de Status */}
          <div className="card">
            <h3>Alterar Status</h3>
            <div className="status-options">
              {(
                [
                  "novo",
                  "contato",
                  "qualificado",
                  "proposta",
                  "negociacao",
                  "ganho",
                  "perdido",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  className={`status-option ${
                    lead.status === status ? "active" : ""
                  }`}
                  style={{
                    borderLeftColor: getStatusColor(status),
                    backgroundColor:
                      lead.status === status
                        ? `${getStatusColor(status)}15`
                        : "transparent",
                  }}
                  onClick={() => handleStatusChange(status)}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Card de Estatísticas */}
          <div className="card">
            <h3>Estatísticas</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Total de Interações</span>
                <span className="stat-value">{lead.interactions.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Última Atualização</span>
                <span className="stat-value">
                  {formatDateTime(lead.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
