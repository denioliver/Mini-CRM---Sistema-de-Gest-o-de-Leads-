import React, { useState } from "react";
import { useLeads } from "../contexts/LeadsContext";
import { useNavigate } from "react-router-dom";
import { LeadStatus, LeadSource } from "../types";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../utils/formatters";
import "./Leads.css";

const Leads: React.FC = () => {
  const {
    filteredLeads,
    filters,
    setFilters,
    exportLeads,
    importLeads,
    deleteLead,
  } = useLeads();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    filters.status || []
  );
  const [selectedSource, setSelectedSource] = useState<string[]>(
    filters.source || []
  );
  const [dateFrom, setDateFrom] = useState<string>(
    filters.dateFrom
      ? new Date(filters.dateFrom).toISOString().split("T")[0]
      : ""
  );
  const [dateTo, setDateTo] = useState<string>(
    filters.dateTo ? new Date(filters.dateTo).toISOString().split("T")[0] : ""
  );

  const statuses = [
    { value: "novo", label: "Novo" },
    { value: "contato", label: "Contato" },
    { value: "qualificado", label: "Qualificado" },
    { value: "proposta", label: "Proposta" },
    { value: "negociacao", label: "Negociação" },
    { value: "ganho", label: "Ganho" },
    { value: "perdido", label: "Perdido" },
  ];

  const sources = [
    { value: "website", label: "Website" },
    { value: "indicacao", label: "Indicação" },
    { value: "telefone", label: "Telefone" },
    { value: "email", label: "Email" },
    { value: "evento", label: "Evento" },
    { value: "midia-social", label: "Mídia Social" },
    { value: "outro", label: "Outro" },
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  const handleStatusFilter = (status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter((s) => s !== status)
      : [...selectedStatus, status];

    setSelectedStatus(newStatus);
    setFilters({
      ...filters,
      status: newStatus.length > 0 ? (newStatus as LeadStatus[]) : undefined,
    });
  };

  const handleSourceFilter = (source: string) => {
    const newSource = selectedSource.includes(source)
      ? selectedSource.filter((s) => s !== source)
      : [...selectedSource, source];

    setSelectedSource(newSource);
    setFilters({
      ...filters,
      source: newSource.length > 0 ? (newSource as LeadSource[]) : undefined,
    });
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    setFilters({
      ...filters,
      dateFrom: value ? new Date(value) : undefined,
    });
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    setFilters({
      ...filters,
      dateTo: value ? new Date(value) : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus([]);
    setSelectedSource([]);
    setDateFrom("");
    setDateTo("");
    setFilters({});
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importLeads(file);
      alert("Leads importados com sucesso!");
    } catch {
      alert("Erro ao importar leads. Verifique o formato do arquivo.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o lead "${name}"?`)) {
      return;
    }

    try {
      await deleteLead(id);
    } catch {
      alert("Erro ao excluir lead. Tente novamente.");
    }
  };

  return (
    <div className="leads-page">
      {/* Header */}
      <div className="leads-header">
        <div>
          <h1>Leads</h1>
          <p className="leads-subtitle">
            {filteredLeads.length}{" "}
            {filteredLeads.length === 1
              ? "lead encontrado"
              : "leads encontrados"}
          </p>
        </div>
        <div className="leads-actions">
          <button className="btn btn-secondary" onClick={exportLeads}>
            <Download size={18} />
            Exportar
          </button>
          <label className="btn btn-secondary">
            <Upload size={18} />
            Importar
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </label>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/leads/new")}
          >
            <Plus size={18} />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="leads-toolbar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, email, empresa..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <button
          className={`btn btn-secondary ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filtros
          {(selectedStatus.length > 0 ||
            selectedSource.length > 0 ||
            dateFrom ||
            dateTo) && (
            <span className="filter-badge">
              {selectedStatus.length +
                selectedSource.length +
                (dateFrom ? 1 : 0) +
                (dateTo ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status:</label>
            <div className="filter-options">
              {statuses.map((status) => (
                <label key={status.value} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes(status.value)}
                    onChange={() => handleStatusFilter(status.value)}
                  />
                  <span>{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Origem:</label>
            <div className="filter-options">
              {sources.map((source) => (
                <label key={source.value} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedSource.includes(source.value)}
                    onChange={() => handleSourceFilter(source.value)}
                  />
                  <span>{source.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Período de Criação:</label>
            <div className="date-filters">
              <div className="date-filter-item">
                <label htmlFor="dateFrom">De:</label>
                <input
                  type="date"
                  id="dateFrom"
                  value={dateFrom}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                />
              </div>
              <div className="date-filter-item">
                <label htmlFor="dateTo">Até:</label>
                <input
                  type="date"
                  id="dateTo"
                  value={dateTo}
                  onChange={(e) => handleDateToChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="leads-table-container">
        {filteredLeads.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum lead encontrado</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/leads/new")}
            >
              <Plus size={18} />
              Adicionar Primeiro Lead
            </button>
          </div>
        ) : (
          <table className="leads-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Empresa</th>
                <th>Contato</th>
                <th>Status</th>
                <th>Origem</th>
                <th>Valor</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="lead-name-cell">
                      <strong>{lead.name}</strong>
                      {lead.position && (
                        <span className="lead-position">{lead.position}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {lead.company ? (
                      <div className="company-cell">
                        <Building2 size={14} />
                        <span>{lead.company}</span>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div className="contact-item">
                        <Mail size={14} />
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                      </div>
                      <div className="contact-item">
                        <Phone size={14} />
                        <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="status-badge-table"
                      style={{ backgroundColor: getStatusColor(lead.status) }}
                    >
                      {statuses.find((s) => s.value === lead.status)?.label}
                    </span>
                  </td>
                  <td>
                    <span className="source-badge">
                      {sources.find((s) => s.value === lead.source)?.label}
                    </span>
                  </td>
                  <td>
                    {lead.value ? (
                      <div className="value-cell">
                        <DollarSign size={14} />
                        <strong>{formatCurrency(lead.value)}</strong>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon"
                        title="Ver detalhes"
                        onClick={() => navigate(`/leads/${lead.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        title="Editar"
                        onClick={() => navigate(`/leads/${lead.id}/edit`)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Excluir"
                        onClick={() => handleDelete(lead.id, lead.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leads;
