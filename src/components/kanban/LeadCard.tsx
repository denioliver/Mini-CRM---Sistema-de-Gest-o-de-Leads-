import React from "react";
import { Lead } from "../../types";
import { Mail, Phone, Building2, TrendingUp } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import "./LeadCard.css";

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/leads/${lead.id}`);
  };

  return (
    <div className="lead-card" onClick={handleClick}>
      <div className="lead-card-header">
        <h4 className="lead-name">{lead.name}</h4>
        {lead.value && (
          <span className="lead-value">{formatCurrency(lead.value)}</span>
        )}
      </div>

      <div className="lead-card-body">
        {lead.company && (
          <div className="lead-info">
            <Building2 size={14} />
            <span>{lead.company}</span>
          </div>
        )}

        <div className="lead-info">
          <Mail size={14} />
          <span>{lead.email}</span>
        </div>

        <div className="lead-info">
          <Phone size={14} />
          <span>{lead.phone}</span>
        </div>

        {lead.tags && lead.tags.length > 0 && (
          <div className="lead-tags">
            {lead.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="lead-tag">
                {tag}
              </span>
            ))}
            {lead.tags.length > 2 && (
              <span className="lead-tag">+{lead.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>

      <div className="lead-card-footer">
        <div className="lead-meta">
          <TrendingUp size={12} />
          <span>{formatDate(lead.createdAt)}</span>
        </div>
        {lead.interactions.length > 0 && (
          <span className="interaction-count">
            {lead.interactions.length} interações
          </span>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
